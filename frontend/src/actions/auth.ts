'use server';

import { cookies } from 'next/headers';
import { authService } from '@/services/auth.service';
import { storeUser } from '@/services/user.service';
import type { User, StoreUser } from '@/types/user.type';
import type { ActionResponse } from '@/types/api.type';

// Action de login: autentica e define cookies de sessão
export async function loginAction(email: string, password: string): Promise<ActionResponse<User>> {
  try {
    const response = await authService.login(email, password);
    const { token, user } = response.data;

    const cookieStore = await cookies();

    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set('user', JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, data: user };
  } catch {
    return { success: false, message: 'E-mail ou senha inválidos.' };
  }
}

// Action de logout: remove cookies de sessão
export async function logoutAction(): Promise<ActionResponse> {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  cookieStore.delete('user');
  return { success: true };
}

// Action de registro: cria conta e já autentica o usuário
export async function registerAction(data: StoreUser): Promise<ActionResponse<User>> {
  try {
    await storeUser(data);

    const loginResponse = await authService.login(data.email, data.password);
    const { token, user } = loginResponse.data;

    const cookieStore = await cookies();

    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set('user', JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, data: user };
  } catch {
    return { success: false, message: 'Não foi possível criar a conta. Tente novamente.' };
  }
}

// Obtém os dados do usuário atual a partir do cookie
export async function getCurrentUserAction(): Promise<User | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user');
  if (!userCookie?.value) return null;
  try {
    return JSON.parse(userCookie.value) as User;
  } catch {
    return null;
  }
}
