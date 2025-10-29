import { useState, useEffect } from 'react'

interface UseApiDataOptions<T> {
  fetchFn: () => Promise<T>
  dependencies?: any[]
  enabled?: boolean
}

interface UseApiDataReturn<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useApiData<T>({ 
  fetchFn, 
  dependencies = [],
  enabled = true,
}: UseApiDataOptions<T>): UseApiDataReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...dependencies])

  const refetch = () => {
    setData(null)
    setIsLoading(true)
    setError(null)
    fetchData()
  }

  return { data, isLoading, error, refetch }
}
