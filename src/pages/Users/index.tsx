import { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'wouter'
import SearchBar from '@/components/ui/search-bar'
import SortDropdown from '@/components/ui/sort-dropdown'
import FilterDropdown from '@/components/ui/filter-dropdown'
import Table from '@/components/ui/table'
import Badge from '@/components/ui/badge'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import { useUsers } from '@/hooks/useUsers'
import Pagination from '@/components/ui/pagination'

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

  // Función para obtener el estado del usuario
  const getUserStatus = (user: any): 'active' | 'blocked' | 'suspended' => {
    // Si el usuario tiene un campo status, usarlo
    if (user.status) {
      const status = user.status.toLowerCase()
      if (status.includes('bloq')) return 'blocked'
      if (status.includes('suspen')) return 'suspended'
      return 'active'
    }
    // Si no, derivar del subscription_status
    if (user.subscription_status === 'cancelled' || user.subscription_status === 'suspended') {
      return 'suspended'
    }
    if (user.subscription_status === 'blocked') {
      return 'blocked'
    }
    return 'active'
  }

  // Función para obtener la variante del badge según el estado
  const getStatusBadgeVariant = (status: 'active' | 'blocked' | 'suspended'): 'status-active' | 'status-blocked' | 'status-suspended' => {
    if (status === 'blocked') return 'status-blocked'
    if (status === 'suspended') return 'status-suspended'
    return 'status-active'
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

    // Aplicar filtros de estado (pueden ser múltiples)
    const statusFilters = filters.filter(f => ['active', 'blocked', 'suspended'].includes(f))
    if (statusFilters.length > 0) {
      filteredUsers = filteredUsers.filter(user => {
        const userStatus = getUserStatus(user)
        return statusFilters.includes(userStatus)
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
                {user.username}
              </Link>
            )
          },
          {
            key: 'created_at',
            header: t('table.registeredAt'),
            widthClass: 'w-[20%]',
            render: (user: any) => {
              const date = new Date(user.created_at)
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
              disabled={selectedUsers.length === 0}
              className="w-full rounded-lg border-0 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed"
              style={{
                backgroundColor: selectedUsers.length > 0 
                  ? 'var(--color-primary-container)' 
                  : 'rgba(23, 29, 30, 0.10)', // M3/state-layers/light/onSurface/opacity-0.10
                color: selectedUsers.length > 0 
                  ? 'var(--color-primary-600)' // On Primary Container
                  : 'var(--color-neutral-500)',
              }}
            >
              {t('actions.warn')}
            </button>
            <button 
              disabled={selectedUsers.length === 0}
              className="w-full rounded-lg border-0 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed"
              style={{
                backgroundColor: selectedUsers.length > 0 
                  ? 'var(--color-primary-500)' 
                  : 'rgba(23, 29, 30, 0.10)', // M3/state-layers/light/onSurface/opacity-0.10
                color: selectedUsers.length > 0 
                  ? 'white' 
                  : 'var(--color-neutral-500)',
              }}
            >
              {t('actions.suspend')}
            </button>
            <button 
              disabled={selectedUsers.length === 0}
              className="w-full rounded-lg border-0 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed"
              style={{
                backgroundColor: selectedUsers.length > 0 
                  ? 'var(--color-error-container)' 
                  : 'rgba(23, 29, 30, 0.10)', // M3/state-layers/light/onSurface/opacity-0.10
                color: selectedUsers.length > 0 
                  ? 'var(--color-error-500)' // Error color for text
                  : 'var(--color-neutral-500)',
              }}
            >
              {t('actions.block')}
            </button>
          </div>
        </div>
        )
      }}
    </ApiStateHandler>
  </>
  )
}