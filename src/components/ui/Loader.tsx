import LoaderSvg from '@/assets/Loader.svg'
import { useTranslation } from 'react-i18next'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
}

export default function Loader({ size = 'md', text, className = '' }: LoaderProps) {
  const { t } = useTranslation('common')
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  } as const

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <img 
        src={LoaderSvg} 
        alt={t('loading')} 
        className={`${sizeClasses[size]} animate-spin`}
      />
      {text && (
        <p className="text-sm text-gray-600">{text}</p>
      )}
    </div>
  )
}
