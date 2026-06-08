import axios from 'axios';
import { cookies } from 'next/headers';

// Cria instância axios para o lado do servidor com token do cookie
export async function getHttpServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10_000,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
