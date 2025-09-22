import { useState, useEffect, useCallback, useRef } from 'react'
import { useApi } from '../../../api'
import { InvoiceGatewayImpl } from '../../gateways'
import { InvoiceEntity } from '../../../domain/entities'
import { Pagination } from '../../../infrastructure/api/types'

interface UseInvoicesParams {
  page?: number
  perPage?: number
}

interface UseInvoicesReturn {
  data: InvoiceEntity[] | null
  loading: boolean
  error: string | null
  pagination: Pagination | null
  refetch: () => void
}

export const useInvoices = ({
  page = 1,
  perPage = 25,
}: UseInvoicesParams = {}): UseInvoicesReturn => {
  const api = useApi()
  const [data, setData] = useState<InvoiceEntity[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const hasFetched = useRef(false)

  const fetchInvoices = useCallback(async () => {
    try {
      if (hasFetched.current) return
      hasFetched.current = true
      setLoading(true)
      setError(null)
      const gateway = new InvoiceGatewayImpl(api)
      const result = await gateway.getAllInvoices(page, perPage)
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
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
      hasFetched.current = false
    }
  }, [api, page, perPage])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  return { data, loading, error, pagination, refetch: fetchInvoices }
}
