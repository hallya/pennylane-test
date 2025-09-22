import { useState, useEffect, useRef } from 'react'
import { useApi } from '../../../api'
import { InvoiceGatewayImpl } from '../../gateways'
import { InvoiceEntity } from '../../../domain/entities'

export const useInvoices = () => {
  const api = useApi()
  const [data, setData] = useState<InvoiceEntity[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetchedRef = useRef(false)

  const fetchInvoices = async () => {
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true
    try {
      setLoading(true)
      const gateway = new InvoiceGatewayImpl(api)
      const invoices = await gateway.getAllInvoices()
      const invoiceEntities = invoices.map(invoice => new InvoiceEntity(invoice))

      invoiceEntities.sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
      setData(invoiceEntities)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      hasFetchedRef.current = false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  return { data, loading, error }
}

