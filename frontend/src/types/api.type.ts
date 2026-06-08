// Resposta de erro padronizada da API
export type ApiResponseError = {
  ok: false
  code: number
  message: string
  errors: string[]
  path: string
  timestamp: string
}

// Resposta de sucesso padronizada da API
export type ApiResponseSuccess<T> = {
  ok: true
  code: number
  message: string | string[]
  data: T
}

// Resposta padronizada para Server Actions
export type ActionResponse<T = void> = {
  success: boolean
  message?: string
  data?: T
}