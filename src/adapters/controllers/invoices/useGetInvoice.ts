import { useState, useEffect, useCallback, useRef } from 'react'
import { useApi } from '../../../infrastructure/api'
import { InvoiceGatewayImpl } from '../../gateways'
import { InvoiceEntity } from '../../../domain/entities'
import { useToast } from '../../../infrastructure/components/hooks/useToast'
import { AxiosError } from 'openapi-client-axios'

interface UseGetInvoiceReturn {
  data: InvoiceEntity | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useGetInvoice = (id: number | null): UseGetInvoiceReturn => {
  const api = useApi()
  const { showToast } = useToast()
  const [data, setData] = useState<InvoiceEntity | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  const fetchInvoice = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const gateway = new InvoiceGatewayImpl(api)
      const invoice = await gateway.getInvoice(id)
      const invoiceEntity = new InvoiceEntity(invoice)
      setData(invoiceEntity)
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
  }, [api, id, showToast])

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    fetchInvoice()
  }, [fetchInvoice])

  return {
    data,
    loading,
    error,
    refetch: fetchInvoice,
  }
}
