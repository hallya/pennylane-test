import { useState, useEffect, useCallback, useRef } from 'react'
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

export const useDashboard = () => {
  const api = useApi()
  const { showToast } = useToast()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetchedRef = useRef(false);

  const fetchDashboardData = useCallback(
    async () => {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;
      try {
        setLoading(true)
        const gateway = new InvoiceGatewayImpl(api)
        const useCase = new GetDashboardData(
          gateway,
          new CalculateCashFlow(),
          new CalculateDeadlineCompliance(),
          new CalculateClientReliability(),
          new CalculateRevenueStructure()
        )
        const result = await useCase.execute()
        setData(result)
      } catch (err) {
        const errorMessage =
          err instanceof AxiosError ? err?.response?.data.message : null
        if (errorMessage) {
          setError(errorMessage)
          showToast(errorMessage, 'error')
        }
        hasFetchedRef.current = false;
      } finally {
        setLoading(false)
      }
    },
    [api, showToast]
  )

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData])

  return { data, loading, error }
}
