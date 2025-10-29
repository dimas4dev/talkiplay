import { useState } from 'react'
import { userService } from '@/services/api'

export function useSendGreeting() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendGreeting = async (userIds: string[]) => {
    setIsLoading(true)
    setError(null)

    try {
      const greetingData = {
        user_ids: userIds,
        message: "¡Bienvenido a ClipNest! 🎉 Estamos emocionados de tenerte aquí. Esperamos que disfrutes explorando todas las increíbles funcionalidades que tenemos para ti. ¡Que tengas una experiencia fantástica!",
        title: "¡Bienvenido a ClipNest!"
      }

      const response = await userService.sendGreeting(greetingData)
      
      if (response.success) {
        return { success: true, message: 'Saludo enviado exitosamente' }
      } else {
        throw new Error(response.message || 'Error al enviar el saludo')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al enviar el saludo'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    sendGreeting,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}
