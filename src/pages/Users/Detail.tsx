import { Link, useParams, useLocation } from 'wouter'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Timeline from '@/components/ui/timeline'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import { ROUTES } from '@/constants/routes'
import { useUserById } from '@/hooks/useUsers'
import { useUserDelete } from '@/hooks/useUserDelete'
import { 
  useWarnAdminUser, 
  useSuspendAdminUser, 
  useBlockAdminUser,
  useActivateAdminUser
} from '@/hooks/useAdminUsers'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import { useToast, ToastContainer } from '@/components/ui/toast'
import FamilyMemberCard from '@/components/users/FamilyMemberCard'
import pinguImage from '@/assets/images/animals/pingu.png'

type RouteParams = { id: string }

export default function UserDetailPage() {
  const { t } = useTranslation('userDetail')
  const params = useParams<RouteParams>()
  const [, setLocation] = useLocation()
  const { data: userData, isLoading, error, refetch } = useUserById(params.id)
  const { deleteUser, isLoading: isDeletingUser } = useUserDelete()
  const { toasts, success, error: showError, removeToast } = useToast()
  const [adminMenuOpen, setAdminMenuOpen] = useState<string | null>(null)
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)
  
  // Estados para modales de acciones
  const [suspendModalOpen, setSuspendModalOpen] = useState(false)
  const [blockModalOpen, setBlockModalOpen] = useState(false)
  const [activateModalOpen, setActivateModalOpen] = useState(false)
  
  // Estados para formularios
  const [suspendDays, setSuspendDays] = useState(7)
  const [suspendReason, setSuspendReason] = useState('')
  const [suspendNotes, setSuspendNotes] = useState('')
  const [blockReason, setBlockReason] = useState('')
  const [blockNotes, setBlockNotes] = useState('')
  const [activateReason, setActivateReason] = useState('')
  const [activateNotes, setActivateNotes] = useState('')
  
  // Hooks de acciones
  const { warn, isLoading: isWarning } = useWarnAdminUser()
  const { suspend, isLoading: isSuspending } = useSuspendAdminUser()
  const { block, isLoading: isBlocking } = useBlockAdminUser()
  const { activate, isLoading: isActivating } = useActivateAdminUser()

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

    const familyName = userData.family?.familyName || userData.name || userData.email || 'Familia'
    
    const result = await deleteUser(params.id)
    
    if (result.success) {
      success(`Familia eliminada`, `${familyName} ha sido eliminada exitosamente`)
      setTimeout(() => {
        setLocation(ROUTES.users)
      }, 1500)
    } else {
      showError('Error al eliminar familia', result.message)
    }
  }

  const handleAdminAction = async (adminId: string, action: 'block' | 'suspend' | 'delete') => {
    setAdminMenuOpen(null)
    // Aquí implementarías la lógica para cada acción
    console.log(`Action ${action} for admin ${adminId}`)
  }

  const handleWarn = async () => {
    if (!params.id) return
    
    try {
      await warn(params.id, {
        reason: 'Advertencia administrativa',
        adminNotes: undefined,
      })
      success('Familia advertida', 'La advertencia se ha registrado correctamente')
      refetch()
    } catch (err) {
      showError('Error al advertir', err instanceof Error ? err.message : 'No se pudo advertir a la familia')
    }
  }

  const handleSuspend = async () => {
    if (!params.id || !suspendReason.trim()) return
    
    try {
      await suspend(params.id, {
        days: suspendDays,
        reason: suspendReason,
        adminNotes: suspendNotes || undefined,
      })
      success('Familia suspendida', `La familia ha sido suspendida por ${suspendDays} días`)
      setSuspendModalOpen(false)
      setSuspendDays(7)
      setSuspendReason('')
      setSuspendNotes('')
      refetch()
    } catch (err) {
      showError('Error al suspender', err instanceof Error ? err.message : 'No se pudo suspender a la familia')
    }
  }

  const handleBlock = async () => {
    if (!params.id || !blockReason.trim()) return
    
    try {
      await block(params.id, {
        reason: blockReason,
        adminNotes: blockNotes || undefined,
      })
      success('Familia bloqueada', 'La familia ha sido bloqueada correctamente')
      setBlockModalOpen(false)
      setBlockReason('')
      setBlockNotes('')
      refetch()
    } catch (err) {
      showError('Error al bloquear', err instanceof Error ? err.message : 'No se pudo bloquear a la familia')
    }
  }

  const handleActivate = async () => {
    if (!params.id || !activateReason.trim()) return
    
    try {
      await activate(params.id, {
        reason: activateReason,
        adminNotes: activateNotes || undefined,
      })
      success('Familia activada', 'La familia ha sido activada/desbloqueada correctamente')
      setActivateModalOpen(false)
      setActivateReason('')
      setActivateNotes('')
      refetch()
    } catch (err) {
      showError('Error al activar', err instanceof Error ? err.message : 'No se pudo activar a la familia')
    }
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
      content: item.action || item.text || ''
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
          // Mapear la estructura de datos de la API
          const familyName = data.family?.familyName || data.name || data.email || 'Familia'
          const familyMembers = data.integrantes || data.family?.members || []
          const administrators = data.administrators || []
          const statusText = getStatusText(data.accountStatus || 'active')

          return (
            <div className="mx-auto max-w-6xl p-6">
              {/* Breadcrumb */}
              <nav className="mb-4 text-sm text-neutral-500">
                <Link href={ROUTES.users} className="underline underline-offset-2">{t('breadcrumb')}</Link>
                <span className="mx-2">/</span>
                <span className="text-neutral-900" style={{ color: '#006874' }}>{familyName}</span>
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
                    <h1 className="mb-4 text-3xl font-semibold text-neutral-900">{familyName}</h1>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-neutral-900 mb-6">
                      <div>ID de usuario</div>
                      <div className="text-right">{data.userId || data.id || '-'}</div>
                      <div>Creación</div>
                      <div className="text-right">
                        {data.createdAt ? new Date(data.createdAt).toLocaleDateString('es-ES', {
                         day: '2-digit',
                         month: 'short',
                         year: 'numeric'
                        }) : '-'}
                      </div>
                      <div>Reportes</div>
                      <div className="text-right">{data.reportCount || 0}</div>
                      <div>Clicks</div>
                      <div className="text-right">{data.clicksCount || 0}</div>
                    </div>

                   </div>
                </div>
              </section>

              {/* Botones de acción */}
              <div className="mb-6 grid grid-cols-3 gap-4">
                <button 
                  onClick={handleWarn}
                  disabled={isWarning || data.accountStatus === 'blocked'}
                  className="w-full rounded-lg border-0 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--color-primary-container)',
                    color: 'var(--color-primary-600)',
                  }}
                >
                  {isWarning ? 'Advertiendo...' : 'Advertir'}
                </button>
                <button
                  onClick={() => setSuspendModalOpen(true)}
                  disabled={isSuspending || data.accountStatus === 'blocked' || data.accountStatus === 'suspended'}
                  className="w-full rounded-lg border-0 px-4 py-3 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--color-primary-500)',
                  }}
                >
                  {isSuspending ? 'Suspendiendo...' : 'Suspender'}
                </button>
                {data.accountStatus === 'blocked' ? (
                  <button
                    onClick={() => setActivateModalOpen(true)}
                    disabled={isActivating}
                    className="w-full rounded-lg border-0 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'var(--color-success-container)',
                      color: 'var(--color-success-600)',
                    }}
                  >
                    {isActivating ? 'Activando...' : 'Activar'}
                  </button>
                ) : (
                  <button
                    onClick={() => setBlockModalOpen(true)}
                    disabled={isBlocking}
                    className="w-full rounded-lg border-0 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'var(--color-error-container)',
                      color: 'var(--color-error-500)',
                    }}
                  >
                    {isBlocking ? 'Bloqueando...' : 'Bloquear'}
                  </button>
                )}
              </div>

              {/* Sección de miembros de la familia */}
              {familyMembers.length > 0 && (
                <section className="mb-6">
                  <h2 className="mb-4 text-xl font-semibold text-neutral-900">Miembros de la familia</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {familyMembers.map((member: any) => {
                      // Mapear type a role (adult -> Adulto, child -> Niño)
                      const role = member.type === 'adult' ? 'Adulto' : member.type === 'child' ? 'Niño' : member.role || 'Miembro'
                      return (
                        <FamilyMemberCard
                          key={member.id}
                          name={member.name || 'Sin nombre'}
                          role={role}
                          avatar={member.avatar || 'penguin'}
                          size="large"
                        />
                      )
                    })}
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
                            {admin.registrationDate ? new Date(admin.registrationDate).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            }) : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={getStatusBadgeVariantLocal(getStatusText(admin.status || 'active'))}>
                              {getStatusText(admin.status || 'active')}
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

      {/* Modal de Suspender */}
      <Modal
        open={suspendModalOpen}
        onClose={() => {
          setSuspendModalOpen(false)
          setSuspendDays(7)
          setSuspendReason('')
          setSuspendNotes('')
        }}
        title="Suspender a la familia"
        footer={
          <>
            <button
              onClick={() => {
                setSuspendModalOpen(false)
                setSuspendDays(7)
                setSuspendReason('')
                setSuspendNotes('')
              }}
              className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSuspend}
              disabled={!suspendReason.trim() || isSuspending}
              className="px-4 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--color-primary-500)' }}
            >
              {isSuspending ? 'Suspendiendo...' : 'Suspender'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Días de suspensión <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={suspendDays}
              onChange={(e) => setSuspendDays(parseInt(e.target.value) || 7)}
              min={1}
              max={365}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Razón de la suspensión <span className="text-red-500">*</span>
            </label>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Describe la razón de la suspensión..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Notas administrativas (opcional)
            </label>
            <textarea
              value={suspendNotes}
              onChange={(e) => setSuspendNotes(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={2}
              placeholder="Notas internas para otros administradores..."
            />
          </div>
        </div>
      </Modal>

      {/* Modal de Bloquear */}
      <Modal
        open={blockModalOpen}
        onClose={() => {
          setBlockModalOpen(false)
          setBlockReason('')
          setBlockNotes('')
        }}
        title="Bloquear a la familia"
        footer={
          <>
            <button
              onClick={() => {
                setBlockModalOpen(false)
                setBlockReason('')
                setBlockNotes('')
              }}
              className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleBlock}
              disabled={!blockReason.trim() || isBlocking}
              className="px-4 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--color-error-500)' }}
            >
              {isBlocking ? 'Bloqueando...' : 'Bloquear'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Razón del bloqueo <span className="text-red-500">*</span>
            </label>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Describe la razón del bloqueo..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Notas administrativas (opcional)
            </label>
            <textarea
              value={blockNotes}
              onChange={(e) => setBlockNotes(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={2}
              placeholder="Notas internas para otros administradores..."
            />
          </div>
        </div>
      </Modal>

      {/* Modal de Activar */}
      <Modal
        open={activateModalOpen}
        onClose={() => {
          setActivateModalOpen(false)
          setActivateReason('')
          setActivateNotes('')
        }}
        title="Activar/Desbloquear a la familia"
        footer={
          <>
            <button
              onClick={() => {
                setActivateModalOpen(false)
                setActivateReason('')
                setActivateNotes('')
              }}
              className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleActivate}
              disabled={!activateReason.trim() || isActivating}
              className="px-4 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--color-success-500)' }}
            >
              {isActivating ? 'Activando...' : 'Activar'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Razón de la activación <span className="text-red-500">*</span>
            </label>
            <textarea
              value={activateReason}
              onChange={(e) => setActivateReason(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Describe la razón de la activación/desbloqueo..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Notas administrativas (opcional)
            </label>
            <textarea
              value={activateNotes}
              onChange={(e) => setActivateNotes(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={2}
              placeholder="Notas internas para otros administradores..."
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
