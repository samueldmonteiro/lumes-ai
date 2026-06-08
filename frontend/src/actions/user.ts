'use server';

import { cookies } from 'next/headers';
import { updateUser } from '@/services/user.service';
import type { UpdateUser, User } from '@/types/user.type';
import type { ActionResponse } from '@/types/api.type';

// Action para atualizar perfil do usuário autenticado
export async function updateProfileAction(data: UpdateUser): Promise<ActionResponse<User>> {
  try {
    const response = await updateUser(data);

    const cookieStore = await cookies();
    cookieStore.set('user', JSON.stringify(response.data), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err?.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.';
    return { success: false, message };
  }
}
