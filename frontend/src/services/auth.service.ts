import { http } from '@/lib/http';
import { ApiResponseSuccess } from '@/types/api.type';
import { LoginResponse } from '@/types/auth.type';

// Serviço de autenticação — comunicação com a API de login
export const authService = {

  async login(email: string, password: string): Promise<ApiResponseSuccess<LoginResponse>> {
    const resp = await http.post<ApiResponseSuccess<LoginResponse>>('/auth/login', { email, password });
    return resp.data;
  },
};