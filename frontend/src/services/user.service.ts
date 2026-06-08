import { http } from '@/lib/http';
import { getHttpServer } from '@/lib/http-server';
import { ApiResponseSuccess } from '@/types/api.type';
import { StoreUser, UpdateUser, User } from '@/types/user.type';

export const storeUser = async (data: StoreUser): Promise<ApiResponseSuccess<User>> => {
  const response = await http.post<ApiResponseSuccess<User>>('auth/register', data);
  return response.data;
};

export const updateUser = async (data: UpdateUser): Promise<ApiResponseSuccess<User>> => {
  const httpServer = await getHttpServer();
  const response = await httpServer.patch<ApiResponseSuccess<User>>('users/me', data);
  return response.data;
};