import pinguImage from '@/assets/images/animals/pingu.png'
import tortugaImage from '@/assets/images/animals/tortuga.png'
import zorroImage from '@/assets/images/animals/zorro.png'
import perritoImage from '@/assets/images/animals/perrito.png'

interface FamilyMemberCardProps {
  name: string
  role: string
  avatar?: string
  size?: 'small' | 'large'
  className?: string
}

export default function FamilyMemberCard({ 
  name, 
  role, 
  avatar = 'penguin',
  size = 'large',
  className = ''
}: FamilyMemberCardProps) {
  // Función para obtener la ruta de la imagen del avatar
  const getAvatarImage = (avatarType: string) => {
    const images: Record<string, string> = {
      penguin: pinguImage,
      turtle: tortugaImage,
      fox: zorroImage,
      dog: perritoImage
    }
    return images[avatarType] || pinguImage
  }

  const avatarImage = getAvatarImage(avatar)

  if (size === 'small') {
    // Versión pequeña para la página de sugerencias
    return (
      <section className={`flex h-full flex-col rounded-2xl border border-neutral-200 bg-white overflow-hidden ${className}`}>
        {/* Sección del avatar con fondo beige */}
        <div className="flex items-center justify-center h-44 w-full bg-[#E1D4C2] overflow-hidden">
          <img src={avatarImage} alt={name} className="h-full w-full object-cover" />
        </div>
        {/* Sección de texto */}
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
          <div className="font-semibold text-neutral-900">{name}</div>
          <div className="mt-1 text-sm text-neutral-500">{role}</div>
        </div>
      </section>
    )
  }

  // Versión grande para la página de detalle de familia
  return (
    <div
      className={`flex flex-col rounded-lg border border-neutral-200 bg-white overflow-hidden ${className}`}
      style={{ minHeight: '240px' }}
    >
      <div className="flex items-center justify-center h-44 w-full bg-[#E1D4C2] rounded-t-lg overflow-hidden">
        <img 
          src={avatarImage} 
          alt={name} 
          className="h-full w-full object-cover rounded-none"
        />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <div className="font-semibold text-neutral-900">{name}</div>
        <div className="mt-1 text-sm text-neutral-500">{role}</div>
      </div>
    </div>
  )
}

