import { Components } from '../../../api/gen/client'

export type InvoiceLineData = {
  product_id: number
  quantity?: number
  label?: string
  unit?: 'hour' | 'day' | 'piece'
  vat_rate?: '0' | '5.5' | '10' | '20'
  price?: string | number
  tax?: string | number
}

export type InvoiceFormData = {
  customer_id: number
  finalized?: boolean
  paid?: boolean
  date?: string
  deadline?: string
  customerName: string
  invoiceLines: Map<number, Components.Schemas.InvoiceLineCreatePayload>
  quantity: number
}

export type ValidationMode = 'save' | 'finalize'
