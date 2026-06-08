import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utilitário para mesclar classes Tailwind com suporte a condicionais
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
