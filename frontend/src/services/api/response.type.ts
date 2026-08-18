export interface ApiEnvelope<T> {
  success: boolean
  code: string
  message: string
  status: number
  data: T
}
