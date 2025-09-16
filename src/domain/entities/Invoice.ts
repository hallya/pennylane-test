import { Invoice } from '../../types'
import { AT_RISK_DSO_DAYS_THRESHOLD, AT_RISK_DSO_MILLISECONDS_THRESHOLD } from '../constants'

export class InvoiceEntity implements Invoice {
  id: number
  customer_id: number | null
  finalized: boolean
  paid: boolean
  date: string | null
  deadline: string | null
  total: string | null
  tax: string | null
  invoice_lines: any[] // Simplified
  customer?: any

  constructor(data: Invoice) {
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

  getTotalAmount(): number {
    if (this.paid && this.total) {
      return parseFloat(this.total)
    }

    return this.invoice_lines.reduce((sum, line) => {
      const price = parseFloat(line.price || '0')
      const quantity = line.quantity || 1
      return sum + price * quantity
    }, 0)
  }

  getOutstandingAmount(): number {
    if (this.paid) return 0
    return this.getTotalAmount()
  }
}
