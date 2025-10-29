import { useApiData } from './useApiData'
import { revenueService, incomeService } from '@/services/api'
import type { RevenueData, RevenuePeriodDetail } from '@/types/dashboard'
import type { 
  ActiveSubscriptionsData, 
  PaymentMethodsData, 
  NetAmountData, 
  CurrentMonthProjectionData, 
  AnnualRevenueData, 
  PeriodsData, 
  PeriodDetailData, 
  RevenueSummaryData 
} from '@/types/revenues'

export function useRevenues() {
  return useApiData<RevenueData>({
    fetchFn: async () => {
      const response = await revenueService.getRevenues()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar los datos de ingresos')
      }
    }
  })
}

export function useRevenuePeriod(period: string) {
  return useApiData<RevenuePeriodDetail>({
    fetchFn: async () => {
      const response = await revenueService.getRevenueByPeriod(period)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(`Error al cargar los datos del período ${period}`)
      }
    }
  })
}

// Nuevos hooks para las APIs de Income/Revenues

// Hook para obtener suscripciones activas
export function useActiveSubscriptions() {
  return useApiData<ActiveSubscriptionsData>({
    fetchFn: async () => {
      const response = await incomeService.getActiveSubscriptions()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar las suscripciones activas')
      }
    }
  })
}

// Hook para obtener métodos de pago detallados
export function usePaymentMethodsDetailed() {
  return useApiData<PaymentMethodsData>({
    fetchFn: async () => {
      const response = await incomeService.getPaymentMethodsDetailed()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar los métodos de pago')
      }
    }
  })
}

// Hook para obtener importe neto
export function useNetAmount() {
  return useApiData<NetAmountData>({
    fetchFn: async () => {
      const response = await incomeService.getNetAmount()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar el importe neto')
      }
    }
  })
}

// Hook para obtener proyección del mes actual
export function useCurrentMonthProjection() {
  return useApiData<CurrentMonthProjectionData>({
    fetchFn: async () => {
      const response = await incomeService.getCurrentMonthProjection()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar la proyección del mes actual')
      }
    }
  })
}

// Hook para obtener ingresos anuales
export function useAnnualRevenue() {
  return useApiData<AnnualRevenueData>({
    fetchFn: async () => {
      const response = await incomeService.getAnnualRevenue()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar los ingresos anuales')
      }
    }
  })
}

// Hook para obtener períodos
export function usePeriods() {
  return useApiData<PeriodsData>({
    fetchFn: async () => {
      const response = await incomeService.getPeriods()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar los períodos')
      }
    }
  })
}

// Hook para obtener detalles de un período específico
export function usePeriodDetails(year: number | null, month: number | null) {
  const enabled = Boolean(year && month && month >= 1 && month <= 12)
  return useApiData<PeriodDetailData>({
    fetchFn: async () => {
      const response = await incomeService.getPeriodDetails(year as number, month as number)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(`Error al cargar los detalles del período ${year}-${month}`)
      }
    },
    dependencies: [year, month],
    enabled
  })
}

// Hook para obtener resumen de ingresos
export function useRevenueSummary() {
  return useApiData<RevenueSummaryData>({
    fetchFn: async () => {
      const response = await incomeService.getRevenueSummary()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar el resumen de ingresos')
      }
    }
  })
}
