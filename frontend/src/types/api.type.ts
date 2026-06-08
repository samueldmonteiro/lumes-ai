export type ApiResponseError = {
  ok: false
  code: number
  message: string
  errors: string[]
  path: string
  timestamp: string
}

export type ApiResponseSuccess<T> = {
  ok: true
  code: number
  message: string | string[]
  data: T
}

export type ActionResponse<T = void> = {
  success: boolean
  message?: string
  data?: T
}