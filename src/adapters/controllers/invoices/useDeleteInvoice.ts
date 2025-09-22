import { useState } from 'react'
import { useApi } from '../../../api'
import { InvoiceGatewayImpl } from '../../gateways'

export const useDeleteInvoice = () => {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteInvoice = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      const gateway = new InvoiceGatewayImpl(api)
      await gateway.deleteInvoice(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { deleteInvoice, loading, error }
}