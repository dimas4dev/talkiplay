import { Link, useParams, useLocation } from 'wouter'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Timeline from '@/components/ui/timeline'
import Badge from '@/components/ui/badge'
import { ROUTES } from '@/constants/routes'
import { useUserById } from '@/hooks/useUsers'
import { useUserDelete } from '@/hooks/useUserDelete'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import { useToast, ToastContainer } from '@/components/ui/toast'
import FamilyMemberCard from '@/components/users/FamilyMemberCard'
import pinguImage from '@/assets/images/animals/pingu.png'

type RouteParams = { id: string }

export default function UserDetailPage() {
  const { t } = useTranslation('userDetail')
  const params = useParams<RouteParams>()
  const [, setLocation] = useLocation()
  const { data: userData, isLoading, error } = useUserById(params.id)
  const { deleteUser, isLoading: isDeletingUser } = useUserDelete()
  const { toasts, success, error: showError, removeToast } = useToast()
  const [adminMenuOpen, setAdminMenuOpen] = useState<string | null>(null)
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)

  // Función para obtener el estado del usuario
  const getUserStatus = (status: string): 'active' | 'blocked' | 'suspended' => {
    if (!status) return 'active'
    const statusLower = status.toLowerCase()
    if (statusLower.includes('bloq')) return 'blocked'
    if (statusLower.includes('suspen')) return 'suspended'
    return 'active'
  }

  // Función para obtener el texto del estado
  const getStatusText = (status: string): string => {
    if (!status) return 'Activo'
    const userStatus = getUserStatus(status)
    if (userStatus === 'blocked') return 'Bloqueado'
    if (userStatus === 'suspended') return 'Suspendido'
    return 'Activo'
  }

  // Función para obtener la variante del badge
  const getStatusBadgeVariantLocal = (statusText: string): 'status-active' | 'status-blocked' | 'status-suspended' => {
    if (statusText === 'Bloqueado') return 'status-blocked'
    if (statusText === 'Suspendido') return 'status-suspended'
    return 'status-active'
  }

  const handleDeleteUser = async () => {
    if (!params.id || !userData) {
      return
    }

    const userName = userData.user?.username || 'Usuario'
    
    const result = await deleteUser(params.id)
    
    if (result.success) {
      success(`Usuario eliminado`, `${userName} ha sido eliminado exitosamente`)
      setTimeout(() => {
        setLocation(ROUTES.users)
      }, 1500)
    } else {
      showError('Error al eliminar usuario', result.message)
    }
  }

  const handleAdminAction = async (adminId: string, action: 'block' | 'suspend' | 'delete') => {
    setAdminMenuOpen(null)
    // Aquí implementarías la lógica para cada acción
    console.log(`Action ${action} for admin ${adminId}`)
    }

  // Función para generar elementos del timeline
  const generateTimelineItems = (data: any) => {
    if (!data.history) return []

    return data.history.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      content: item.text
    }))
  }


  return (
    <>
      <ApiStateHandler
        isLoading={isLoading}
        error={error}
        data={userData}
        loadingText={t('loading')}
        errorTitle={t('errorTitle')}
        emptyText={t('emptyText')}
      >
        {(data) => {
          const user = data.user
          const familyMembers = data.family_members || []
          const administrators = data.administrators || []
          const statusText = getStatusText(user.status || 'active')

          return (
            <div className="mx-auto max-w-6xl p-6">
              {/* Breadcrumb */}
              <nav className="mb-4 text-sm text-neutral-500">
                <Link href={ROUTES.users} className="underline underline-offset-2">{t('breadcrumb')}</Link>
                <span className="mx-2">/</span>
                <span className="text-neutral-900" style={{ color: '#006874' }}>{user.username}</span>
              </nav>

              {/* Sección superior - Información de la familia */}
              <section className="mb-6 rounded-lg border border-neutral-200 bg-white p-6 relative">
                {/* Menú de acciones */}
                <div className="absolute right-4 top-4" tabIndex={-1} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeaderMenuOpen(false) }}>
                  <button
                    className="h-8 w-8 rounded hover:bg-neutral-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={() => setHeaderMenuOpen((prev) => !prev)}
                  >
                    <span className="ms text-lg">more_vert</span>
                  </button>
                  {headerMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg border border-neutral-200 bg-white shadow-md p-2 z-10">
                      <button
                        onClick={handleDeleteUser}
                        disabled={isDeletingUser}
                        className="flex w-full items-center gap-3 rounded px-3 py-2 text-left hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 text-danger-600"
                      >
                        <span className="ms">delete</span>
                        <span>Eliminar cuenta</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-6">
                  {/* Avatar + estado */}
                  <div className="flex w-48 flex-col items-center">
                    <div className="relative">
                      <div className="h-32 w-32 rounded-full bg-neutral-100 overflow-hidden flex items-center justify-center">
                        <img 
                          src={pinguImage} 
                          alt="Familia" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="mt-4 text-center flex flex-col items-center">
                      <div className="flex items-center gap-2 text-sm text-neutral-900">
                        <span className="text-neutral-500">Estado</span>
                        <Badge variant={getStatusBadgeVariantLocal(statusText)}>{statusText}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Información de la familia */}
                  <div className="flex-1">
                    <h1 className="mb-4 text-3xl font-semibold text-neutral-900">{user.username}</h1>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-neutral-900 mb-6">
                      <div>ID de usuario</div>
                      <div className="text-right">{user.user_id || '000022'}</div>
                      <div>Creación</div>
                      <div className="text-right">
                        {new Date(user.created_at).toLocaleDateString('es-ES', {
                         day: '2-digit',
                         month: 'short',
                         year: 'numeric'
                        })}
                      </div>
                      <div>Reportes</div>
                      <div className="text-right">{user.reports || 0}</div>
                      <div>Clicks</div>
                      <div className="text-right">{user.clicks || 0}</div>
                    </div>

                   </div>
                </div>
              </section>

              {/* Botones de acción */}
              <div className="mb-6 grid grid-cols-3 gap-4">
                <button 
                  className="w-full rounded-lg border-0 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{
                    backgroundColor: 'var(--color-primary-container)',
                    color: 'var(--color-primary-600)',
                  }}
                >
                  Advertir
                </button>
                <button
                  className="w-full rounded-lg border-0 px-4 py-3 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{
                    backgroundColor: 'var(--color-primary-500)',
                  }}
                >
                  Suspender
                </button>
                <button
                  className="w-full rounded-lg border-0 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  style={{
                    backgroundColor: 'var(--color-error-container)',
                    color: 'var(--color-error-500)',
                  }}
                >
                  Bloquear
                </button>
              </div>

              {/* Sección de miembros de la familia */}
              {familyMembers.length > 0 && (
                <section className="mb-6">
                  <h2 className="mb-4 text-xl font-semibold text-neutral-900">Miembros de la familia</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {familyMembers.map((member: any) => (
                      <FamilyMemberCard
                        key={member.id}
                        name={member.name}
                        role={member.role}
                        avatar={member.avatar}
                        size="large"
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Tabla de administradores */}
              {administrators.length > 0 && (
                <section className="mb-6 rounded-lg border border-neutral-200 bg-white overflow-visible">
                  <table className="w-full">
                    <thead className="bg-[var(--color-surface-variant)]">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Administrador</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Correo</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Registro</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Estado</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {administrators.map((admin: any, index: number) => (
                        <tr key={admin.id} className={index > 0 ? 'border-t border-neutral-200' : ''}>
                          <td className="px-6 py-4 text-sm text-neutral-900">{admin.name}</td>
                          <td className="px-6 py-4 text-sm text-neutral-900">{admin.email}</td>
                          <td className="px-6 py-4 text-sm text-neutral-900">
                            {new Date(admin.created_at).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={getStatusBadgeVariantLocal(getStatusText(admin.status))}>
                              {getStatusText(admin.status)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="relative">
                              <button
                                onClick={() => setAdminMenuOpen(adminMenuOpen === admin.id ? null : admin.id)}
                                className="h-8 w-8 rounded hover:bg-neutral-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                <span className="ms text-lg">more_vert</span>
                              </button>
                              {adminMenuOpen === admin.id && (
                                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-neutral-200 bg-white shadow-md p-2 z-10">
                                  <button
                                    onClick={() => handleAdminAction(admin.id, 'block')}
                                    className="flex w-full items-center gap-3 rounded px-3 py-2 text-left hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  >
                                    <span className="ms text-neutral-900">block</span>
                                    <span className="text-neutral-900">Bloquear</span>
                                  </button>
                                  <button
                                    onClick={() => handleAdminAction(admin.id, 'suspend')}
                                    className="flex w-full items-center gap-3 rounded px-3 py-2 text-left hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  >
                                    <span className="ms text-neutral-900">warning</span>
                                    <span className="text-neutral-900">Suspender</span>
                                  </button>
                                  <button
                                    onClick={() => handleAdminAction(admin.id, 'delete')}
                                    className="flex w-full items-center gap-3 rounded px-3 py-2 text-left hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 text-red-600"
                                  >
                                    <span className="ms">delete</span>
                                    <span>Eliminar cuenta</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}

              {/* Historial */}
              <section className="rounded-lg border border-neutral-200 bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-neutral-900">Historial</h2>
                  <span className="ms text-primary-600">expand_less</span>
                </div>
                <Timeline items={generateTimelineItems(data)} />
              </section>
            </div>
          )
        }}
      </ApiStateHandler>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
