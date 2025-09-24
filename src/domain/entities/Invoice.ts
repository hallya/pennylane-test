import { DomainInvoice, DomainInvoiceLine, DomainCustomer } from '../types'
import {
  AT_RISK_DSO_MILLISECONDS_THRESHOLD,
  INVOICE_STATUS,
} from '../constants'

export class InvoiceEntity implements DomainInvoice {
  id: number
  customer_id: number | null
  finalized: boolean
  paid: boolean
  date: string | null
  deadline: string | null
  total: string | null
  tax: string | null
  invoice_lines: DomainInvoiceLine[]
  customer?: DomainCustomer

  constructor(data: DomainInvoice) {
    this.id = data.id
    this.customer_id = data.customer_id
    this.finalized = data.finalized
    this.paid = data.paid
    this.date = data.date
    this.deadline = data.deadline
    this.total = data.total
    this.tax = data.tax
    this.invoice_lines = data.invoice_lines
    this.customer = data.customer
  }

  isOverdue(): boolean {
    if (!this.deadline || this.paid) return false
    return new Date(this.deadline) < new Date()
  }

  isDueSoon(): boolean {
    if (!this.deadline || this.paid) return false
    return (
      new Date(this.deadline) >= new Date() &&
      new Date(this.deadline) <=
        new Date(Date.now() + AT_RISK_DSO_MILLISECONDS_THRESHOLD)
    )
  }

  getSubtotalAmount(): number {
    if (!this.invoice_lines || this.invoice_lines.length === 0) {
      return 0
    }

    return this.invoice_lines.reduce((sum, line) => {
      const price = parseFloat(line.price || '0')
      const tax = parseFloat(line.tax || '0')
      const quantity = line.quantity
      return sum + (price - tax) * quantity
    }, 0)
  }

  getTotalAmount(): number {
    const subtotal = this.getSubtotalAmount()
    const tax = this.getTotalTaxAmount()
    return subtotal + tax
  }

  getOutstandingAmount(): number {
    if (this.paid) return 0
    return this.getTotalAmount()
  }

  getTotalTaxAmount(): number {
    if (!this.invoice_lines || this.invoice_lines.length === 0) {
      return 0
    }

    return this.invoice_lines.reduce((totalTax, line) => {
      const quantity = line.quantity || 1
      const tax = parseFloat(line.tax || '0')
      const lineTax = quantity * tax
      return totalTax + lineTax
    }, 0)
  }

  getStatus(): (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS] {
    if (this.paid) return INVOICE_STATUS.PAID
    if (!this.finalized) return INVOICE_STATUS.DRAFT
    if (this.isOverdue()) return INVOICE_STATUS.OVERDUE
    return INVOICE_STATUS.FINALIZED_UNPAID
  }
}
