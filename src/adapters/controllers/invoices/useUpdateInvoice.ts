import { useState } from 'react'
import { useApi } from '../../../api'
import { InvoiceGatewayImpl } from '../../gateways'
import { InvoiceEntity } from '../../../domain/entities'
import { Components } from '../../../api/gen/client'
import { useToast } from '../../../infrastructure/components/hooks/useToast'
import { AxiosError } from 'openapi-client-axios'

export const useUpdateInvoice = () => {
  const api = useApi()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateInvoice = async (id: number, payload: Components.Schemas.InvoiceUpdatePayload) => {
    try {
      setLoading(true)
      setError(null)
      const gateway = new InvoiceGatewayImpl(api)
      const invoice = await gateway.updateInvoice(id, payload)
      return new InvoiceEntity(invoice)
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
  }

  return { updateInvoice, loading, error }
}