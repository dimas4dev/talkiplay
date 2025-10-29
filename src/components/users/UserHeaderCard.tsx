import { useState } from 'react'
import Badge from '@/components/ui/badge'
import { getStatusBadgeVariant } from '@/utils/badgeVariants'
import { Link } from 'wouter'
import { ROUTES } from '@/constants/routes'

export type UserHeader = {
  id: number
  name: string
  email: string
  userId: string
  subscription: string
  status: string
  registrationDate: string
  reports?: number
  nextPayment?: string
  history?: Array<{ date: string; text: string }>
}

interface Translations {
  subscription: string
  userId: string
  email: string
  registration: string
  reports: string
  status: string
  block: string
  unblock: string
  viewReports: string
  deleteAccount: string
  updating: string
}

interface Props {
  user: UserHeader
  onToggleStatus?: () => void
  isUpdatingStatus?: boolean
  onDeleteUser?: () => void
  isDeletingUser?: boolean
  translations?: Translations
}

export default function UserHeaderCard({ user, onToggleStatus, isUpdatingStatus = false, onDeleteUser, isDeletingUser = false, translations }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <section className="mb-6 rounded-lg border border-neutral-200 bg-white p-6 relative">
      {/* Opciones */}
      <div className="absolute right-4 top-4" tabIndex={-1} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setMenuOpen(false) }}>
        <button className="h-10 w-10 rounded hover:bg-neutral-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500" onClick={() => setMenuOpen((o) => !o)} aria-haspopup="menu" aria-expanded={menuOpen}>
          <span className="ms ms-32">more_vert</span>
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-lg border border-neutral-200 bg-white shadow-md p-2 z-10" role="menu">
            <button 
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500" 
              role="menuitem"
              onClick={onToggleStatus}
              disabled={isUpdatingStatus}
            >
              <span className="ms text-neutral-900">
                {user.status === 'Bloqueado' ? 'lock_open' : 'block'}
              </span>
              <span className="text-neutral-900">
                {isUpdatingStatus ? (translations?.updating || 'Actualizando...') : user.status === 'Bloqueado' ? (translations?.unblock || 'Desbloquear') : (translations?.block || 'Bloquear')}
              </span>
            </button>
            <Link href={`${ROUTES.reports}/${user.id}`} className="flex w-full items-center gap-3 rounded px-3 py-2 text-left hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500" role="menuitem">
              <span className="ms text-neutral-900">visibility</span>
              <span className="text-neutral-900">{translations?.viewReports || 'Ver reportes'}</span>
            </Link>
            <button 
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left hover:bg-danger-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500" 
              role="menuitem"
              onClick={onDeleteUser}
              disabled={isDeletingUser || isUpdatingStatus}
            >
              <span className="ms text-danger-600">delete</span>
              <span className="text-danger-600">
                {isDeletingUser ? (translations?.updating || 'Eliminando...') : (translations?.deleteAccount || 'Eliminar cuenta')}
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-start gap-6">
        {/* Avatar + estado */}
        <div className="flex w-48 flex-col items-center">
          <div className="relative">
            <div className="h-40 w-40 rounded-full bg-neutral-100" />
            <span className="material-symbols-outlined absolute top-1 left-1 text-[22px] text-primary-600 leading-none" aria-hidden="true">stars</span>
          </div>
          <div className="mt-4 text-center">
            <span className="mr-2 text-sm text-neutral-900">{translations?.status || 'Estado'}:</span>
            <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
          </div>
        </div>

        <div className="flex-1">
          <h1 className="mb-2 text-3xl font-semibold text-neutral-900">{user.name}</h1>
          <div className="grid grid-cols-2 gap-2 text-sm text-neutral-900">
            <div>{translations?.subscription || 'Suscripción'}</div>
            <div className="text-right">{user.subscription}</div>
            <div>{translations?.userId || 'ID de usuario'}</div>
            <div className="text-right">{user.userId}</div>
            <div>{translations?.email || 'Correo'}</div>
            <div className="text-right">{user.email}</div>
            <div>{translations?.registration || 'Registro'}</div>
            <div className="text-right">{user.registrationDate}</div>
            <div>{translations?.reports || 'Reportes'}</div>
            <div className="text-right">{user.reports ?? 0}</div>
          </div>
        </div>
      </div>
    </section>
  )
}


