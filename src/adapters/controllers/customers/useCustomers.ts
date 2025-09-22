import { useState } from 'react'
import { useApi } from '../../../api'
import { CustomerGatewayImpl } from '../../gateways'
import { Components } from '../../../api/gen/client'
import { SearchCustomersUseCaseImpl } from '../../../domain/useCases'

export const useSearchCustomers = () => {
  const api = useApi()
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
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche'
      setError(errorMessage)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  return { customers, loading, error, searchCustomers }
}