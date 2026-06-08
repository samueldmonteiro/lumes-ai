import { User } from './user.type';

export type LoginResponse = {
  token: string;
  user: User;
};