
export type UserRole = 'USER' | 'ADMIN';

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  password: string
};

export type StoreUser = {
  name:string
  email:string
  password: string;
}