import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email requerido').email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  remember: z.boolean().optional().default(true),
})

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email requerido').email('Email inválido'),
})

export const verifyOTPSchema = z.object({
  email: z.string().min(1, 'Email requerido').email('Email inválido'),
  code: z.string().min(6, 'El código debe tener 6 dígitos').max(6, 'El código debe tener 6 dígitos').regex(/^\d{6}$/, 'El código debe contener solo números'),
})

export const resetPasswordSchema = z.object({
  email: z.string().min(1, 'Email requerido').email('Email inválido'),
  code: z.string().min(6, 'El código debe tener 6 dígitos').max(6, 'El código debe tener 6 dígitos').regex(/^\d{6}$/, 'El código debe contener solo números'),
  newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export type LoginSchema = z.infer<typeof loginSchema>
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
export type VerifyOTPSchema = z.infer<typeof verifyOTPSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>


