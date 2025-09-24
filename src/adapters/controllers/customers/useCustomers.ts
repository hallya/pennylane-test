import { useState } from 'react'
import { useApi } from '../../../infrastructure/api'
import { CustomerGatewayImpl } from '../../gateways'
import { Components } from '../../../domain/types/api'
import { SearchCustomersUseCaseImpl } from '../../../domain/useCases'
import { useToast } from '../../../infrastructure/components/hooks/useToast'
import { AxiosError } from 'openapi-client-axios'

export const useSearchCustomers = () => {
  const api = useApi()
  const { showToast } = useToast()
  const [customers, setCustomers] = useState<Components.Schemas.Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const customerGateway = new CustomerGatewayImpl(api)
  const searchCustomersUseCase = new SearchCustomersUseCaseImpl(customerGateway)

  const searchCustomers = async (query: string) => {
    if (query.length < 3) {
      setCustomers([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const results = await searchCustomersUseCase.execute(query)
      setCustomers(results)
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError ? err?.response?.data.message : null
      if (errorMessage) {
        setError(errorMessage)
        showToast(errorMessage, 'error')
      }
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  return { customers, loading, error, searchCustomers }
}