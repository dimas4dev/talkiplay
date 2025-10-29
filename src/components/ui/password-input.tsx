import { useState, type JSX } from 'react'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

type PasswordInputProps = Omit<JSX.IntrinsicElements['input'], 'type'> & {
  id?: string
}

export function PasswordInput({ id = 'password', className, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input id={id} type={show ? 'text' : 'password'} className={className ? className + ' pr-10' : 'pr-10'} {...props} />
      <button
        type="button"
        aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-neutral-700"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}

export default PasswordInput


