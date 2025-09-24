import { useState } from 'react'
import { useApi } from '../../../infrastructure/api'
import { InvoiceGatewayImpl } from '../../gateways'
import { useToast } from '../../../infrastructure/components/hooks/useToast'
import { AxiosError } from 'openapi-client-axios'

export const useDeleteInvoice = () => {
  const api = useApi()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteInvoice = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      const gateway = new InvoiceGatewayImpl(api)
      await gateway.deleteInvoice(id)
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError ? err?.response?.data.message : null
      if (errorMessage) {
        setError(errorMessage)
        showToast(errorMessage, 'error')
      }
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { deleteInvoice, loading, error }
}
