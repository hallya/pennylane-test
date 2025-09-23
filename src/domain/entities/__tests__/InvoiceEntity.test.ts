import { describe, it, expect } from 'vitest'
import { InvoiceEntity } from '../Invoice'
import { InvoiceTestDataFactory, InvoiceLineTestDataFactory } from '../../__tests__/utils'
import { INVOICE_STATUS } from '../../constants'

describe('InvoiceEntity', () => {
  describe('isOverdue', () => {
    it('should return false for paid invoices', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.paid())
      expect(invoice.isOverdue()).toBe(false)
    })

    it('should return false for invoices without deadline', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.withoutDeadline())
      expect(invoice.isOverdue()).toBe(false)
    })

    it('should return false for invoices with future deadline', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.future())
      expect(invoice.isOverdue()).toBe(false)
    })

    it('should return true for unpaid invoices with past deadline', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.overdue())
      expect(invoice.isOverdue()).toBe(true)
    })
  })

  describe('isDueSoon', () => {
    it('should return false for paid invoices', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.paid())
      expect(invoice.isDueSoon()).toBe(false)
    })

    it('should return false for invoices without deadline', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.withoutDeadline())
      expect(invoice.isDueSoon()).toBe(false)
    })

    it('should return false for invoices with far future deadline', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.future())
      expect(invoice.isDueSoon()).toBe(false)
    })

    it('should return true for unpaid invoices due soon', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.dueSoon())
      expect(invoice.isDueSoon()).toBe(true)
    })
  })

  describe('getSubtotalAmount', () => {
    it('should return 0 for invoices with no lines', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.create({ invoice_lines: [] }))
      expect(invoice.getSubtotalAmount()).toBe(0)
    })

    it('should calculate subtotal correctly for single line', () => {
      const line = InvoiceLineTestDataFactory.create({
        price: '100.00',
        tax: '20.00',
        quantity: 1
      })
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.create({ invoice_lines: [line] }))
      expect(invoice.getSubtotalAmount()).toBe(80)
    })

    it('should calculate subtotal correctly for multiple lines', () => {
      const line1 = InvoiceLineTestDataFactory.create({
        price: '100.00',
        tax: '20.00',
        quantity: 2
      })
      const line2 = InvoiceLineTestDataFactory.create({
        price: '50.00',
        tax: '5.00',
        quantity: 1
      })
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.create({ invoice_lines: [line1, line2] }))
      expect(invoice.getSubtotalAmount()).toBe(205)
    })

    it('should handle zero tax correctly', () => {
      const line = InvoiceLineTestDataFactory.create({
        price: '100.00',
        tax: '0.00',
        quantity: 1
      })
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.create({ invoice_lines: [line] }))
      expect(invoice.getSubtotalAmount()).toBe(100)
    })

    it('should handle decimal values correctly', () => {
      const line = InvoiceLineTestDataFactory.create({
        price: '10.50',
        tax: '2.10',
        quantity: 3
      })
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.create({ invoice_lines: [line] }))
      expect(invoice.getSubtotalAmount()).toBeCloseTo(25.2, 1)
    })
  })

  describe('getTotalTaxAmount', () => {
    it('should return 0 for invoices with no lines', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.create({ invoice_lines: [] }))
      expect(invoice.getTotalTaxAmount()).toBe(0)
    })

    it('should calculate total tax correctly for single line', () => {
      const line = InvoiceLineTestDataFactory.create({
        tax: '20.00',
        quantity: 1
      })
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.create({ invoice_lines: [line] }))
      expect(invoice.getTotalTaxAmount()).toBe(20)
    })

    it('should calculate total tax correctly for multiple lines', () => {
      const line1 = InvoiceLineTestDataFactory.create({
        tax: '20.00',
        quantity: 2
      })
      const line2 = InvoiceLineTestDataFactory.create({
        tax: '5.00',
        quantity: 1
      })
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.create({ invoice_lines: [line1, line2] }))
      expect(invoice.getTotalTaxAmount()).toBe(45) // 20*2 + 5*1
    })

    it('should handle zero tax correctly', () => {
      const line = InvoiceLineTestDataFactory.create({
        tax: '0.00',
        quantity: 1
      })
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.create({ invoice_lines: [line] }))
      expect(invoice.getTotalTaxAmount()).toBe(0)
    })

    it('should handle decimal values correctly', () => {
      const line = InvoiceLineTestDataFactory.create({
        tax: '2.10',
        quantity: 3
      })
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.create({ invoice_lines: [line] }))
      expect(invoice.getTotalTaxAmount()).toBeCloseTo(6.3, 1) // 2.10 * 3
    })
  })

  describe('getTotalAmount', () => {
    it('should return subtotal plus tax', () => {
      const line = InvoiceLineTestDataFactory.create({
        price: '100.00',
        tax: '20.00',
        quantity: 1
      })
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.create({ invoice_lines: [line] }))
      expect(invoice.getTotalAmount()).toBe(100) // 80 + 20
    })

    it('should handle multiple lines correctly', () => {
      const line1 = InvoiceLineTestDataFactory.create({
        price: '100.00',
        tax: '20.00',
        quantity: 2
      })
      const line2 = InvoiceLineTestDataFactory.create({
        price: '50.00',
        tax: '5.00',
        quantity: 1
      })
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.create({ invoice_lines: [line1, line2] }))
      expect(invoice.getTotalAmount()).toBe(250) // 205 + 45
    })

    it('should return 0 for invoices with no lines', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.create({ invoice_lines: [] }))
      expect(invoice.getTotalAmount()).toBe(0)
    })
  })

  describe('getOutstandingAmount', () => {
    it('should return 0 for paid invoices', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.paid())
      expect(invoice.getOutstandingAmount()).toBe(0)
    })

    it('should return total amount for unpaid invoices', () => {
      const line = InvoiceLineTestDataFactory.create({
        price: '100.00',
        tax: '20.00',
        quantity: 1
      })
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.unpaid({ invoice_lines: [line] }))
      expect(invoice.getOutstandingAmount()).toBe(100)
    })

    it('should return 0 for unpaid invoices with no lines', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.unpaid({ invoice_lines: [] }))
      expect(invoice.getOutstandingAmount()).toBe(0)
    })
  })

  describe('getStatus', () => {
    it('should return PAID for paid invoices', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.paid())
      expect(invoice.getStatus()).toBe(INVOICE_STATUS.PAID)
    })

    it('should return DRAFT for non-finalized invoices', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.create({ finalized: false }))
      expect(invoice.getStatus()).toBe(INVOICE_STATUS.DRAFT)
    })

    it('should return OVERDUE for unpaid finalized overdue invoices', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.overdue({ finalized: true, paid: false }))
      expect(invoice.getStatus()).toBe(INVOICE_STATUS.OVERDUE)
    })

    it('should return FINALIZED_UNPAID for unpaid finalized non-overdue invoices', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.future({ finalized: true, paid: false }))
      expect(invoice.getStatus()).toBe(INVOICE_STATUS.FINALIZED_UNPAID)
    })

    it('should prioritize PAID over other statuses', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.overdue({ paid: true }))
      expect(invoice.getStatus()).toBe(INVOICE_STATUS.PAID)
    })

    it('should prioritize DRAFT over OVERDUE', () => {
      const invoice = new InvoiceEntity(InvoiceTestDataFactory.overdue({ finalized: false }))
      expect(invoice.getStatus()).toBe(INVOICE_STATUS.DRAFT)
    })
  })
})