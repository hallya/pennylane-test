import { useState } from 'react'
import { InvoiceGatewayImpl } from '../../gateways'
import { InvoiceEntity } from '../../../domain/entities'
import { DomainInvoiceCreatePayload } from '../../../domain/types'
import { useToast } from '../../../infrastructure/components/hooks/useToast'
import { AxiosError } from 'openapi-client-axios'
import { useApi } from '../../../infrastructure/api'

export const useCreateInvoice = () => {
  const api = useApi()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createInvoice = async (payload: DomainInvoiceCreatePayload) => {
    try {
      setLoading(true)
      setError(null)
      const gateway = new InvoiceGatewayImpl(api)
      const invoice = await gateway.createInvoice(payload)
      return new InvoiceEntity(invoice)
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

  return { createInvoice, loading, error }
}