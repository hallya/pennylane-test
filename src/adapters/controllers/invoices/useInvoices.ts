import { useState, useEffect, useCallback, useRef } from 'react'
import { useApi } from '../../../infrastructure/api'
import { InvoiceGatewayImpl } from '../../gateways'
import { InvoiceEntity } from '../../../domain/entities'
import { Components } from '../../../domain/types/api'
import { useToast } from '../../../infrastructure/components/hooks/useToast'
import { AxiosError } from 'openapi-client-axios'
import { InvoiceFilters } from '../../../domain/useCases/InvoiceGateway'

interface UseInvoicesParams {
  page?: number
  perPage?: number
  customerId?: number
}

interface UseInvoicesReturn {
  data: InvoiceEntity[] | null
  loading: boolean
  error: string | null
  pagination: Components.Schemas.Pagination | null
  refetch: () => void
}

export const useInvoices = ({
  page = 1,
  perPage = 25,
  customerId,
}: UseInvoicesParams = {}): UseInvoicesReturn => {
  const api = useApi()
  const { showToast } = useToast()
  const [data, setData] = useState<InvoiceEntity[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Components.Schemas.Pagination | null>(null)
  const hasFetched = useRef(false)

  const fetchInvoices = useCallback(async () => {
    try {
      if (hasFetched.current) return
      hasFetched.current = true
      setLoading(true)
      setError(null)
      const gateway = new InvoiceGatewayImpl(api)
      const filters: InvoiceFilters = {}
      if (customerId !== undefined) {
        filters.customerId = customerId
      }
      const result = await gateway.getAllInvoices(page, perPage, filters)
      const invoiceEntities = result.invoices.map(
        (invoice) => new InvoiceEntity(invoice)
      )
      invoiceEntities.sort(
        (a, b) =>
          new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
      )
      setData(invoiceEntities)
      setPagination(result.pagination)
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError ? err?.response?.data.message : null
      if (errorMessage) {
        setError(errorMessage)
        showToast(errorMessage, 'error')
      }
    } finally {
      setLoading(false)
      hasFetched.current = false
    }
  }, [api, page, perPage, customerId, showToast])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  return { data, loading, error, pagination, refetch: fetchInvoices }
}
