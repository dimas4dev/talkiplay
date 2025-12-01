// Tipos base para la API
// TODO: Agregar tipos específicos según se vayan implementando los endpoints

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
}
