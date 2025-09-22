import { useState } from 'react'
import { useApi } from '../../../api'
import { InvoiceGatewayImpl } from '../../gateways'
import { InvoiceEntity } from '../../../domain/entities'
import { Components } from '../../../api/gen/client'

export const useCreateInvoice = () => {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createInvoice = async (payload: Components.Schemas.InvoiceCreatePayload) => {
    try {
      setLoading(true)
      setError(null)
      const gateway = new InvoiceGatewayImpl(api)
      const invoice = await gateway.createInvoice(payload)
      return new InvoiceEntity(invoice)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { createInvoice, loading, error }
}