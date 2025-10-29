import { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'wouter'
import SearchBar from '@/components/ui/search-bar'
import SortDropdown from '@/components/ui/sort-dropdown'
import FilterDropdown from '@/components/ui/filter-dropdown'
import Table from '@/components/ui/table'
import Badge from '@/components/ui/badge'
import { getSubscriptionStatusBadgeVariant } from '@/utils/badgeVariants'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import { useUsers } from '@/hooks/useUsers'
import { useSendGreeting } from '@/hooks/useSendGreeting'
import { ExportButton, exportToCSV } from '@/components/ui/export-button'
import Pagination from '@/components/ui/pagination'
import PaginationInfo from '@/components/ui/pagination-info'
import { useToast, ToastContainer } from '@/components/ui/toast'

export default function Users() {
  const { t } = useTranslation('users')
  const [location] = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortValue, setSortValue] = useState<'username' | 'created_at' | 'role'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc') // desc = más reciente primero
  const [filters, setFilters] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)

  // Función para leer parámetros de URL y aplicar filtros automáticamente
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const filterParam = urlParams.get('filter')

    if (filterParam === 'inactive') {
      // Aplicar filtro de usuarios inactivos
      setFilters(['inactive'])
      // También cambiar el ordenamiento para mostrar los más inactivos primero
      setSortValue('created_at')
      setSortOrder('desc')
    }
  }, [location])

  const { sendGreeting, isLoading: isSendingGreeting } = useSendGreeting()
  const { toasts, success, error: showError, removeToast } = useToast()

  // Funciones para manejar selección de usuarios
  const handleUserSelection = (userId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers(prev => [...prev, userId])
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    }
  }

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers(data?.users?.map((user: any) => user.id) || [])
    } else {
      setSelectedUsers([])
    }
  }

  const handleSendGreeting = async () => {
    if (selectedUsers.length === 0) {
      showError('Selección requerida', 'Por favor selecciona al menos un usuario para enviar el saludo')
      return
    }

    const result = await sendGreeting(selectedUsers)
    if (result.success) {
      success(
        '¡Saludo enviado!', 
        `Se envió exitosamente el saludo de bienvenida a ${selectedUsers.length} usuario(s)`
      )
      setSelectedUsers([]) // Limpiar selección
    } else {
      showError('Error al enviar saludo', result.message)
    }
  }

  // Funciones de navegación para las stats-cards
  const handleTotalUsersClick = () => {
    // Limpiar todos los filtros para mostrar todos los usuarios
    setFilters([])
    setSearchTerm('')
    setPage(1)
  }

  const handleAdminsClick = () => {
    // Filtrar por administradores
    setFilters(['admin'])
    setSearchTerm('')
    setPage(1)
  }

  const handleRegularUsersClick = () => {
    // Filtrar por usuarios regulares
    setFilters(['regular'])
    setSearchTerm('')
    setPage(1)
  }

  const handleWithSubscriptionClick = () => {
    // Filtrar por usuarios con suscripción activa
    setFilters(['active'])
    setSearchTerm('')
    setPage(1)
  }

  // Query simple sin filtros ya que el API no los acepta
  const query = useMemo(() => ({
    page: 1,
    limit: 1000, // Obtener todos los usuarios para filtrar localmente
  }), [])

  const { data: allUsersData, isLoading, error } = useUsers(query)
  
  // Aplicar filtros localmente
  const filteredAndPaginatedData = useMemo(() => {
    if (!allUsersData?.users) return { users: [], totals: allUsersData?.totals || {} }

    let filteredUsers = [...allUsersData.users]

    // Aplicar búsqueda
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      filteredUsers = filteredUsers.filter(user => 
        user.username?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      )
    }

    // Aplicar filtros de stats-cards
    const adminFilter = filters.find(f => f === 'admin')
    if (adminFilter) {
      filteredUsers = filteredUsers.filter(user => user.role === 'admin')
    }

    const regularFilter = filters.find(f => f === 'regular')
    if (regularFilter) {
      filteredUsers = filteredUsers.filter(user => user.role !== 'admin')
    }

    // Aplicar filtros existentes
    const membershipFilter = filters.find(f => ['explorer', 'premium', 'pro'].includes(f))
    if (membershipFilter) {
      filteredUsers = filteredUsers.filter(user => {
        // Por ahora, mapear basado en subscription_status hasta que tengamos más datos
        if (membershipFilter === 'explorer') {
          return !user.subscription_status || user.subscription_status === 'none'
        } else if (membershipFilter === 'premium') {
          return user.subscription_status === 'active' // Asumir que 'active' incluye premium
        } else if (membershipFilter === 'pro') {
          return user.subscription_status === 'active' // Asumir que 'active' incluye pro
        }
        return false
      })
    }

    const statusFilter = filters.find(f => ['active', 'blocked', 'inactive'].includes(f))
    if (statusFilter) {
      filteredUsers = filteredUsers.filter(user => {
        if (statusFilter === 'active') {
          return user.subscription_status === 'active'
        } else if (statusFilter === 'blocked') {
          return user.role === 'admin' // Temporal: usar role como proxy para "bloqueado"
        } else if (statusFilter === 'inactive') {
          return user.subscription_status === 'cancelled' || user.subscription_status === 'none'
        }
        return false
      })
    }

    // Aplicar ordenamiento
    filteredUsers.sort((a, b) => {
      let aValue, bValue
      
      switch (sortValue) {
        case 'username':
          aValue = (a.username || '').toLowerCase()
          bValue = (b.username || '').toLowerCase()
          break
        case 'role':
          aValue = (a.role || '').toLowerCase()
          bValue = (b.role || '').toLowerCase()
          break
        case 'created_at':
        default:
          // Asegurar que las fechas se parseen correctamente
          const dateA = new Date(a.created_at)
          const dateB = new Date(b.created_at)
          
          
          // Verificar que las fechas sean válidas
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn('Fecha inválida encontrada:', { a: a.created_at, b: b.created_at })
            return 0
          }
          
          aValue = dateA.getTime()
          bValue = dateB.getTime()
          break
      }

      // Ordenamiento más robusto
      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1
      } else if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1
      } else {
        return 0
      }
    })

    // Aplicar paginación
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return {
      users: paginatedUsers,
      totals: {
        ...allUsersData.totals,
        total_users: filteredUsers.length,
        filtered_users: filteredUsers.length
      },
      pagination: {
        total: filteredUsers.length,
        page,
        limit: pageSize,
        total_pages: Math.ceil(filteredUsers.length / pageSize)
      }
    }
  }, [allUsersData, searchTerm, filters, sortValue, sortOrder, page, pageSize])

  const data = filteredAndPaginatedData

  // Columnas de la tabla (ocultando rol, email y clips)
  const columns = [
    {
      key: 'checkbox',
      header: (
        <input 
          type="checkbox" 
          className="rounded border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500" 
          checked={selectedUsers.length > 0 && selectedUsers.length === data?.users?.length}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      widthClass: 'w-[8%]',
      render: (user: any) => (
        <input 
          type="checkbox" 
          className="rounded border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500" 
          checked={selectedUsers.includes(user.id)}
          onChange={(e) => handleUserSelection(user.id, e.target.checked)}
        />
      )
    },
    {
      key: 'username',
      header: t('table.name'),
      widthClass: 'w-[25%]',
      render: (user: any) => (
        <Link href={`/users/${user.id}`} className="text-primary-600 underline hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded">
          {user.username}
        </Link>
      )
    },
    {
      key: 'created_at',
      header: t('table.registeredAt'),
      widthClass: 'w-[20%]',
      render: (user: any) => new Date(user.created_at).toLocaleDateString('es-ES')
    },
    {
      key: 'subscription_status',
      header: t('table.subscription'),
      widthClass: 'w-[25%]',
      render: (user: any) => (
        <Badge variant={getSubscriptionStatusBadgeVariant(user.subscription_status)}>
          {user.subscription_status === 'active' ? t('table.subscriptionStatus.active') :
            user.subscription_status === 'cancelled' ? t('table.subscriptionStatus.cancelled') : t('table.subscriptionStatus.none')}
        </Badge>
      )
    }
  ]

  return (
    <>
    <ApiStateHandler isLoading={isLoading} error={error} data={data} loadingText={t('loading')} errorTitle={t('errorTitle')} emptyText={t('emptyText')}>
      {(data) => (
        <div className="mx-auto max-w-6xl p-6">
          {/* Resumen */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            <section 
              className="rounded-lg border border-neutral-200 bg-white p-4 text-center cursor-pointer transition-colors hover:bg-neutral-50 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={handleTotalUsersClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleTotalUsersClick()
                }
              }}
            >
              <div className="text-sm text-neutral-500">{t('stats.total')}</div>
              <div className="text-2xl font-bold">{data.totals?.total_users ?? 0}</div>
            </section>
            <section 
              className="rounded-lg border border-neutral-200 bg-white p-4 text-center cursor-pointer transition-colors hover:bg-neutral-50 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={handleAdminsClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleAdminsClick()
                }
              }}
            >
              <div className="text-sm text-neutral-500">{t('stats.admins')}</div>
              <div className="text-2xl font-bold">{data.totals?.admin_users ?? 0}</div>
            </section>
            <section 
              className="rounded-lg border border-neutral-200 bg-white p-4 text-center cursor-pointer transition-colors hover:bg-neutral-50 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={handleRegularUsersClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleRegularUsersClick()
                }
              }}
            >
              <div className="text-sm text-neutral-500">{t('stats.regular')}</div>
              <div className="text-2xl font-bold">{data.totals?.regular_users ?? 0}</div>
            </section>
            <section 
              className="rounded-lg border border-neutral-200 bg-white p-4 text-center cursor-pointer transition-colors hover:bg-neutral-50 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={handleWithSubscriptionClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleWithSubscriptionClick()
                }
              }}
            >
              <div className="text-sm text-neutral-500">{t('stats.withSubscription')}</div>
              <div className="text-2xl font-bold">{data.totals?.users_with_subscriptions ?? 0}</div>
            </section>
          </div>


          {/* Barra de herramientas */}
          <div className="mb-6 flex items-center gap-6 w-full">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={(v) => { setPage(1); setSearchTerm(v) }}
                placeholder={t('toolbar.search')}
              />
            </div>
            <div className="flex-1">
              <SortDropdown
                value={`${sortValue}_${sortOrder === 'asc' ? 'asc' : 'desc'}`}
                onChange={(v: any) => { 
                  setPage(1)
                  // Corregir el split para manejar campos con guiones bajos
                  const lastUnderscoreIndex = v.lastIndexOf('_')
                  const field = v.substring(0, lastUnderscoreIndex)
                  const order = v.substring(lastUnderscoreIndex + 1)
                  setSortValue(field)
                  setSortOrder(order)
                }}
                label={t('toolbar.sort')}
                groups={[
                  {
                    key: 'name',
                    labelKey: 'sort.name',
                    options: [
                      { value: 'username_asc', labelKey: 'sort.nameAsc' },
                      { value: 'username_desc', labelKey: 'sort.nameDesc' },
                    ]
                  },
                  {
                    key: 'date',
                    labelKey: 'sort.date',
                    options: [
                      { value: 'created_at_asc', labelKey: 'sort.paymentOldNew' },
                      { value: 'created_at_desc', labelKey: 'sort.paymentNewOld' },
                    ]
                  },
                  {
                    key: 'role',
                    labelKey: 'sort.role',
                    options: [
                      { value: 'role_desc', labelKey: 'sort.subHighLow' },
                      { value: 'role_asc', labelKey: 'sort.subLowHigh' },
                    ]
                  }
                ]}
              />
            </div>
            <div className="flex-1">
              <FilterDropdown
                values={filters}
                onChange={(vals) => { 
                  setPage(1)
                  setFilters(vals)
                }}
                namespace="memberships"
                label={t('toolbar.filter')}
                groups={[
                  {
                    key: 'membership',
                    labelKey: 'filter.membership',
                    options: [
                      { value: 'explorer', labelKey: 'filter.explorer' },
                      { value: 'premium', labelKey: 'filter.premium' },
                      { value: 'pro', labelKey: 'filter.pro' },
                    ]
                  },
                  {
                    key: 'status',
                    labelKey: 'filter.status',
                    options: [
                      { value: 'active', labelKey: 'filter.active' },
                      { value: 'blocked', labelKey: 'filter.blocked' },
                      { value: 'inactive', labelKey: 'filter.inactive' },
                    ]
                  }
                ]}
              />
            </div>
          </div>

          {/* Tabla */}
          <div className="mb-6">
            <Table
              columns={columns as any}
              data={data.users}
              className="w-full"
            />
          </div>

          {/* Información de paginación */}
          <div className="mb-2">
            <PaginationInfo 
              total={data.pagination?.total || 0}
              currentStart={((page - 1) * pageSize) + 1}
              currentEnd={Math.min(page * pageSize, data.pagination?.total || 0)}
              itemName="usuarios"
            />
          </div>
          
          {/* Paginación */}
          <div className="flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={data.pagination?.total_pages || 1}
              onPageChange={setPage}
            />
          </div>

          {/* Información adicional */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <span className="ms ms-18">info</span>
              <span>{t('info.inactiveHint')}</span>
            </div>
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-primary-600">
                <span className="ms">check_circle</span>
                <span>{t('info.selectedUsers', { count: selectedUsers.length })}</span>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-2 gap-6">
            <button 
              onClick={handleSendGreeting}
              disabled={isSendingGreeting || selectedUsers.length === 0}
              className="w-full rounded border border-neutral-300 bg-white px-4 py-2 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {isSendingGreeting ? t('actions.sending') : `${t('actions.sendGreeting')}${selectedUsers.length > 0 ? ` (${selectedUsers.length})` : ''}`}
            </button>
            <ExportButton
              text={t('actions.exportUsers')}
              onExport={() => {
                try {
                  const rows = data.users.map((user: any) => ({
                    [t('export.username')]: user.username || 'N/A',
                    [t('export.registeredAt')]: user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A',
                    [t('export.subscription')]: user.subscription_status === 'active' ? t('table.subscriptionStatus.active') :
                      user.subscription_status === 'cancelled' ? t('table.subscriptionStatus.cancelled') : t('table.subscriptionStatus.none'),
                    [t('export.folders')]: user.total_folders || 0,
                  }))
                  exportToCSV(rows, t('export.fileName'))
                } catch (error) {
                  console.error('Error al exportar usuarios:', error)
                }
              }}
              disabled={!data.users?.length}
            />
          </div>
        </div>
      )}
    </ApiStateHandler>
    
    {/* Toast Container */}
    <ToastContainer toasts={toasts} onRemove={removeToast} />
  </>
  )
}