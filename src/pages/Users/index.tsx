import { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'wouter'
import SearchBar from '@/components/ui/search-bar'
import SortDropdown from '@/components/ui/sort-dropdown'
import FilterDropdown from '@/components/ui/filter-dropdown'
import Table from '@/components/ui/table'
import Badge from '@/components/ui/badge'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import {
  useAdminUsers,
  useWarnAdminUser,
  useSuspendAdminUser,
  useBlockAdminUser,
} from '@/hooks/useAdminUsers'
import Pagination from '@/components/ui/pagination'
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

  // Toasts
  const { toasts, removeToast, success, error: showError } = useToast()

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

  // Funciones para manejar selección de usuarios
  const handleUserSelection = (userId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers(prev => [...prev, userId])
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    }
  }

  const handleSelectAll = (isSelected: boolean, currentUsers?: any[]) => {
    if (isSelected) {
      setSelectedUsers(currentUsers?.map((user: any) => user.id) || [])
    } else {
      setSelectedUsers([])
    }
  }

  // Función para normalizar el estado del usuario
  const normalizeStatus = (status: string): 'active' | 'blocked' | 'suspended' => {
    if (!status) return 'active'
    const statusLower = status.toLowerCase()
    if (statusLower.includes('bloq') || statusLower === 'blocked') return 'blocked'
    if (statusLower.includes('suspen') || statusLower === 'suspended') return 'suspended'
    return 'active'
  }

  // Función para obtener el estado del usuario
  const getUserStatus = (user: any): 'active' | 'blocked' | 'suspended' => {
    // Normalizar el estado que viene de la API
    const status = user.accountStatus || user.status
    return normalizeStatus(status)
  }

  // Función para obtener la variante del badge según el estado
  const getStatusBadgeVariant = (status: 'active' | 'blocked' | 'suspended'): 'status-active' | 'status-blocked' | 'status-suspended' => {
    if (status === 'blocked') return 'status-blocked'
    if (status === 'suspended') return 'status-suspended'
    return 'status-active'
  }

  // Query para obtener todos los usuarios (sin filtros, para filtrar localmente)
  const query = useMemo(
    () => ({
      page: 1,
      limit: 1000, // Obtener una cantidad grande para filtrar localmente
    }),
    [],
  )

  const { data: adminUsersData, isLoading, error, refetch } = useAdminUsers(query)

  // Hooks de acciones masivas sobre familias
  const { warn, isLoading: isWarning } = useWarnAdminUser()
  const { suspend, isLoading: isSuspending } = useSuspendAdminUser()
  const { block, isLoading: isBlocking } = useBlockAdminUser()
  
  // Transformar y aplicar filtros localmente
  const filteredAndPaginatedData = useMemo(() => {
    if (!adminUsersData?.data) return { users: [], totals: {}, pagination: { total: 0, page: 1, limit: pageSize, total_pages: 0 } }

    // Transformar AdminFamilyListItem a formato esperado
    let filteredUsers = adminUsersData.data.map(family => {
      // Normalizar el estado
      const status = family.status || family.accountStatus || 'active'
      const normalizedStatus = normalizeStatus(status)
      
      return {
        id: family.id,
        username: family.name || family.email, // Usar name como username, fallback a email
        email: family.email,
        familyName: family.name,
        created_at: family.registrationDate || family.createdAt, // Usar registrationDate primero
        accountStatus: normalizedStatus, // Estado normalizado
        status: status, // Mantener el estado original también
        warnings: family.warnings || 0,
        reportCount: family.reportCount || 0,
      }
    })

    // Aplicar búsqueda
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      filteredUsers = filteredUsers.filter(user => 
        user.email?.toLowerCase().includes(searchLower) ||
        user.familyName?.toLowerCase().includes(searchLower) ||
        user.username?.toLowerCase().includes(searchLower)
      )
    }

    // Aplicar filtros de estado (pueden ser múltiples)
    const statusFilters = filters.filter(f => ['active', 'blocked', 'suspended'].includes(f))
    if (statusFilters.length > 0) {
      filteredUsers = filteredUsers.filter(user => {
        const userStatus = user.accountStatus
        return statusFilters.includes(userStatus)
      })
    }

    // Aplicar ordenamiento local
    filteredUsers.sort((a, b) => {
      let aValue, bValue
      
      switch (sortValue) {
        case 'username':
          aValue = (a.email || '').toLowerCase()
          bValue = (b.email || '').toLowerCase()
          break
        case 'created_at':
        default:
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0)
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0)
          
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0
          }
          
          aValue = dateA.getTime()
          bValue = dateB.getTime()
          break
      }

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1
      } else if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1
      } else {
        return 0
      }
    })

    // Aplicar paginación local
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return {
      users: paginatedUsers,
      totals: {
        total_users: filteredUsers.length,
      },
      pagination: {
        total: filteredUsers.length,
        page,
        limit: pageSize,
        total_pages: Math.ceil(filteredUsers.length / pageSize),
      }
    }
  }, [adminUsersData, searchTerm, filters, sortValue, sortOrder, page, pageSize])


  const data = filteredAndPaginatedData

  return (
    <>
    <ApiStateHandler isLoading={isLoading} error={error} data={data} loadingText={t('loading')} errorTitle={t('errorTitle')} emptyText={t('emptyText')}>
      {(data) => {
        // Columnas de la tabla
        const columns = [
          {
            key: 'checkbox',
            header: (
              <input 
                type="checkbox" 
                className="rounded border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                style={{ accentColor: 'var(--color-primary-500)' }}
                checked={selectedUsers.length > 0 && selectedUsers.length === (data?.users?.length || 0) && data?.users?.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked, data?.users)}
              />
            ),
            widthClass: 'w-[8%]',
            render: (user: any) => (
              <input 
                type="checkbox" 
                className="rounded border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                style={{ accentColor: 'var(--color-primary-500)' }}
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
              <Link 
                href={`/users/${user.id}`} 
                className="underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded transition-opacity"
                style={{ color: '#006874' }}
              >
                {user.email}
              </Link>
            )
          },
          {
            key: 'created_at',
            header: t('table.registeredAt'),
            widthClass: 'w-[20%]',
            render: (user: any) => {
              if (!user.created_at) return '-'
              const date = new Date(user.created_at)
              if (isNaN(date.getTime())) return '-'
              return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
            }
          },
          {
            key: 'status',
            header: t('table.status'),
            widthClass: 'w-[25%]',
            render: (user: any) => {
              const status = getUserStatus(user)
              const variant = getStatusBadgeVariant(status)
              return (
                <Badge variant={variant}>
                  {status === 'active' ? t('table.statusTypes.active') :
                    status === 'blocked' ? t('table.statusTypes.blocked') : t('table.statusTypes.suspended')}
                </Badge>
              )
            }
          }
        ]

        return (
          <div className="mx-auto max-w-6xl p-6">
            {/* Información de usuarios y paginación */}
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-medium text-neutral-900">
                {data.totals?.total_users ?? 0} Usuarios
              </div>
              <div className="text-sm text-neutral-500">
                {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, data.pagination?.total || 0)} of {data.pagination?.total || 0}
              </div>
            </div>

          {/* Barra de herramientas */}
          <div className="mb-6 flex items-center gap-6 w-full">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={(v) => { 
                  setPage(1)
                  setSearchTerm(v)
                }}
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
                namespace="users"
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
                    labelKey: 'sort.registeredDate',
                    options: [
                      { value: 'created_at_asc', labelKey: 'sort.oldToNew' },
                      { value: 'created_at_desc', labelKey: 'sort.newToOld' },
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
                namespace="users"
                label={t('toolbar.filter')}
                groups={[
                  {
                    key: 'status',
                    labelKey: 'filter.status',
                    options: [
                      { value: 'active', labelKey: 'filter.active' },
                      { value: 'blocked', labelKey: 'filter.blocked' },
                      { value: 'suspended', labelKey: 'filter.suspended' },
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
              headerStyle={{ backgroundColor: 'var(--color-surface-variant)' }}
            />
          </div>

          {/* Paginación */}
          <div className="mb-6 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={data.pagination?.total_pages || 1}
              onPageChange={setPage}
            />
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={async () => {
                if (selectedUsers.length === 0) return
                try {
                  await Promise.all(
                    selectedUsers.map((id) =>
                      warn(id, {
                        reason: 'Advertencia administrativa desde la lista de usuarios',
                        adminNotes: undefined,
                      }),
                    ),
                  )
                  success('Familias advertidas', `Se ha advertido a ${selectedUsers.length} familia(s).`)
                  setSelectedUsers([])
                  refetch()
                } catch (err) {
                  showError(
                    'Error al advertir',
                    err instanceof Error ? err.message : 'No se pudo advertir a las familias seleccionadas',
                  )
                }
              }}
              disabled={selectedUsers.length === 0 || isWarning}
              className="w-full rounded-lg border-0 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed"
              style={{
                backgroundColor:
                  selectedUsers.length > 0 && !isWarning
                    ? 'var(--color-primary-container)'
                    : 'rgba(23, 29, 30, 0.10)',
                color:
                  selectedUsers.length > 0 && !isWarning
                    ? 'var(--color-primary-600)'
                    : 'var(--color-neutral-500)',
              }}
            >
              {isWarning ? t('actions.warning') || 'Advirtiendo...' : t('actions.warn')}
            </button>
            <button
              onClick={async () => {
                if (selectedUsers.length === 0) return
                try {
                  await Promise.all(
                    selectedUsers.map((id) =>
                      suspend(id, {
                        days: 7,
                        reason: 'Suspensión desde la lista de usuarios',
                        adminNotes: undefined,
                      }),
                    ),
                  )
                  success('Familias suspendidas', `Se ha suspendido a ${selectedUsers.length} familia(s) por 7 días.`)
                  setSelectedUsers([])
                  refetch()
                } catch (err) {
                  showError(
                    'Error al suspender',
                    err instanceof Error ? err.message : 'No se pudo suspender a las familias seleccionadas',
                  )
                }
              }}
              disabled={selectedUsers.length === 0 || isSuspending}
              className="w-full rounded-lg border-0 px-4 py-3 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed"
              style={{
                backgroundColor:
                  selectedUsers.length > 0 && !isSuspending
                    ? 'var(--color-primary-500)'
                    : 'rgba(23, 29, 30, 0.10)',
                color: selectedUsers.length > 0 && !isSuspending ? 'white' : 'var(--color-neutral-500)',
              }}
            >
              {isSuspending ? t('actions.suspending') || 'Suspendiendo...' : t('actions.suspend')}
            </button>
            <button
              onClick={async () => {
                if (selectedUsers.length === 0) return
                try {
                  await Promise.all(
                    selectedUsers.map((id) =>
                      block(id, {
                        reason: 'Bloqueo desde la lista de usuarios',
                        adminNotes: undefined,
                      }),
                    ),
                  )
                  success('Familias bloqueadas', `Se ha bloqueado a ${selectedUsers.length} familia(s).`)
                  setSelectedUsers([])
                  refetch()
                } catch (err) {
                  showError(
                    'Error al bloquear',
                    err instanceof Error ? err.message : 'No se pudo bloquear a las familias seleccionadas',
                  )
                }
              }}
              disabled={selectedUsers.length === 0 || isBlocking}
              className="w-full rounded-lg border-0 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed"
              style={{
                backgroundColor:
                  selectedUsers.length > 0 && !isBlocking
                    ? 'var(--color-error-container)'
                    : 'rgba(23, 29, 30, 0.10)',
                color:
                  selectedUsers.length > 0 && !isBlocking
                    ? 'var(--color-error-500)'
                    : 'var(--color-neutral-500)',
              }}
            >
              {isBlocking ? t('actions.blocking') || 'Bloqueando...' : t('actions.block')}
            </button>
          </div>
        </div>
        )
      }}
    </ApiStateHandler>
    <ToastContainer toasts={toasts} onRemove={removeToast} />
  </>
  )
}