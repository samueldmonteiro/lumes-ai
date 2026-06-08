import axios from 'axios';

// Instância axios base para chamadas à API (lado do cliente)
export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});