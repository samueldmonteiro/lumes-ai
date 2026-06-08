import { http } from '@/lib/http';
import { ApiResponseSuccess } from '@/types/api.type';
import { StoreUser, User } from '@/types/user.type';

export const storeUser = async (data: StoreUser): Promise<ApiResponseSuccess<User>> => {
  const response = await http.post<ApiResponseSuccess<User>>('auth/register', data);
  return response.data;
};