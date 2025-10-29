import Loader from './Loader'

interface ApiStateHandlerProps<T = any> {
  isLoading: boolean
  error: string | null
  data: T | null
  loadingText?: string
  errorTitle?: string
  emptyText?: string
  children: (data: T) => React.ReactNode
}

export default function ApiStateHandler<T = any>({
  isLoading,
  error,
  data,
  loadingText = "Cargando...",
  errorTitle = "Error",
  emptyText = "No hay datos disponibles",
  children
}: ApiStateHandlerProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="xl" text={loadingText} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-danger-600 mb-2">{errorTitle}</div>
          <div className="text-sm text-neutral-600">{error}</div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-neutral-600">{emptyText}</div>
      </div>
    )
  }

  return <>{children(data)}</>
}
