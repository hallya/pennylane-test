import { describe, it, expect, beforeEach } from 'vitest'
import { CalculateCashFlow } from './CalculateCashFlow'
import {
  InvoiceTestDataFactory,
} from '../__tests__/utils'

const AMOUNT_1000 = '1000.00'
const AMOUNT_2000 = '2000.00'
const AMOUNT_500 = '500.00'

describe('CalculateCashFlow', () => {
  let useCase: CalculateCashFlow

  beforeEach(() => {
    useCase = new CalculateCashFlow()
  })

  it('should return zero values for no invoices', () => {
    const result = useCase.execute([])
    expect(result.totalIssued).toBe(0)
    expect(result.totalReceived).toBe(0)
    expect(result.outstandingReceivables).toBe(0)
    expect(result.dso).toBe(0)
    expect(result.isAtRisk).toBe(false)
  })

  it('should calculate totals for paid invoices', () => {
    const invoices = [
      InvoiceTestDataFactory.paid({ total: AMOUNT_1000 }),
      InvoiceTestDataFactory.paid({ total: AMOUNT_2000 }),
    ]
    const result = useCase.execute(invoices)
    expect(result.totalIssued).toBe(3000)
    expect(result.totalReceived).toBe(3000)
    expect(result.outstandingReceivables).toBe(0)
    expect(result.dso).toBe(0)
    expect(result.isAtRisk).toBe(false)
  })

  it('should calculate totals for unpaid invoices', () => {
    const invoices = [
      InvoiceTestDataFactory.unpaid({ total: AMOUNT_1000 }),
      InvoiceTestDataFactory.unpaid({ total: AMOUNT_2000 }),
    ]
    const result = useCase.execute(invoices)
    expect(result.totalIssued).toBe(3000)
    expect(result.totalReceived).toBe(0)
    expect(result.outstandingReceivables).toBe(3000)
    expect(result.dso).toBe(30)
    expect(result.isAtRisk).toBe(false)
  })

  it('should calculate mixed paid and unpaid invoices', () => {
    const invoices = [
      InvoiceTestDataFactory.paid({ total: AMOUNT_1000 }),
      InvoiceTestDataFactory.unpaid({ total: AMOUNT_2000 }),
      InvoiceTestDataFactory.unpaid({ total: AMOUNT_500 }),
    ]
    const result = useCase.execute(invoices)
    expect(result.totalIssued).toBe(3500)
    expect(result.totalReceived).toBe(1000)
    expect(result.outstandingReceivables).toBe(2500)
    expect(result.dso).toBeCloseTo(21.43, 2)
    expect(result.isAtRisk).toBe(false)
  })

  it('should identify at risk by outstanding amount', () => {
    const invoices = [InvoiceTestDataFactory.unpaid({ total: '15000.00' })]
    const result = useCase.execute(invoices)
    expect(result.totalIssued).toBe(15000)
    expect(result.totalReceived).toBe(0)
    expect(result.outstandingReceivables).toBe(15000)
    expect(result.dso).toBe(30)
    expect(result.isAtRisk).toBe(true)
  })

  it('should handle partial payments', () => {
    const invoices = [
      InvoiceTestDataFactory.paid({ total: AMOUNT_1000 }),
      InvoiceTestDataFactory.unpaid({ total: AMOUNT_1000 }),
    ]
    const result = useCase.execute(invoices)
    expect(result.totalIssued).toBe(2000)
    expect(result.totalReceived).toBe(1000)
    expect(result.outstandingReceivables).toBe(1000)
    expect(result.dso).toBe(15)
    expect(result.isAtRisk).toBe(false)
  })

  it('should handle zero total issued', () => {
    const invoices = [InvoiceTestDataFactory.create({ total: '0.00' })]
    const result = useCase.execute(invoices)
    expect(result.totalIssued).toBe(0)
    expect(result.totalReceived).toBe(0)
    expect(result.outstandingReceivables).toBe(0)
    expect(result.dso).toBe(0)
    expect(result.isAtRisk).toBe(false)
  })
})
