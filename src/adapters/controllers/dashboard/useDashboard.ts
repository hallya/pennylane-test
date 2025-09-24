import { useState, useEffect, useCallback } from 'react'
import { useApi } from '../../../api'
import { InvoiceGatewayImpl } from '../../gateways'
import {
  GetDashboardData,
  CalculateCashFlow,
  CalculateDeadlineCompliance,
  CalculateClientReliability,
  CalculateRevenueStructure,
  DashboardData,
} from '../../../domain/useCases'
import { useToast } from '../../../infrastructure/components/hooks/useToast'
import { AxiosError } from 'openapi-client-axios'
import { useDashboardSearchParams } from './useDashboardSearchParams'

export const useDashboard = () => {
  const api = useApi()
  const { showToast } = useToast()
  const { year } = useDashboardSearchParams()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(
    async (currentYear: number) => {
      try {
        setLoading(true)
        setError(null)
        const gateway = new InvoiceGatewayImpl(api)
        const useCase = new GetDashboardData(
          gateway,
          new CalculateCashFlow(),
          new CalculateDeadlineCompliance(),
          new CalculateClientReliability(),
          new CalculateRevenueStructure()
        )
        const result = await useCase.execute(currentYear)
        setData(result)
      } catch (err) {
        const errorMessage =
          err instanceof AxiosError ? err?.response?.data.message : null
        if (errorMessage) {
          setError(errorMessage)
          showToast(errorMessage, 'error')
        }
      } finally {
        setLoading(false)
      }
    },
    [api, showToast]
  )

  useEffect(() => {
    fetchDashboardData(year);
  }, [fetchDashboardData, year])

  return { data, loading, error }
}
