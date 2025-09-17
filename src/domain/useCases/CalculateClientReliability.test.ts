import { describe, it, expect, beforeEach } from 'vitest'
import { CalculateClientReliability } from './CalculateClientReliability'
import {
  InvoiceTestDataFactory,
  CustomerTestDataFactory,
} from '../__tests__/utils'

const CUSTOMER_1 = CustomerTestDataFactory.create({
  first_name: 'John',
  last_name: 'Doe',
})
const CUSTOMER_2 = CustomerTestDataFactory.create({
  first_name: 'Jane',
  last_name: 'Smith',
})

describe('CalculateClientReliability', () => {
  let useCase: CalculateClientReliability

  beforeEach(() => {
    useCase = new CalculateClientReliability()
  })

  it('should return empty arrays for no invoices', () => {
    const result = useCase.execute([])
    expect(result.latePayers).toEqual([])
    expect(result.largeOutstanding).toEqual([])
  })

  it('should ignore invoices without customer', () => {
    const invoices = [
      InvoiceTestDataFactory.overdue({
        customer_id: undefined,
        customer: undefined,
      }),
    ]
    const result = useCase.execute(invoices)
    expect(result.latePayers).toEqual([])
    expect(result.largeOutstanding).toEqual([])
  })

  it('should identify late payers', () => {
    const invoices = [
      InvoiceTestDataFactory.overdue({
        id: 1,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '1000.00',
      }),
      InvoiceTestDataFactory.overdue({
        id: 2,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '2000.00',
      }),
      InvoiceTestDataFactory.unpaid({
        id: 3,
        customer_id: CUSTOMER_2.id,
        customer: CUSTOMER_2,
        total: '500.00',
      }),
    ]
    const result = useCase.execute(invoices)
    expect(result.latePayers).toHaveLength(1)
    expect(result.latePayers[0]).toEqual({
      customerId: CUSTOMER_1.id,
      name: 'John Doe',
      lateCount: 2,
    })
    expect(result.largeOutstanding).toEqual([])
  })

  it('should identify large outstanding amounts', () => {
    const invoices = [
      InvoiceTestDataFactory.unpaid({
        id: 1,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '6000.00',
      }),
      InvoiceTestDataFactory.unpaid({
        id: 2,
        customer_id: CUSTOMER_2.id,
        customer: CUSTOMER_2,
        total: '3000.00',
      }),
    ]
    const result = useCase.execute(invoices)
    expect(result.latePayers).toEqual([])
    expect(result.largeOutstanding).toHaveLength(1)
    expect(result.largeOutstanding[0]).toEqual({
      customerId: CUSTOMER_1.id,
      name: 'John Doe',
      amount: 6000,
    })
  })

  it('should handle mixed scenarios', () => {
    const customer3 = CustomerTestDataFactory.create({
      first_name: 'Bob',
      last_name: 'Wilson',
    })
    const invoices = [
      InvoiceTestDataFactory.overdue({
        id: 1,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '3000.00',
      }),
      InvoiceTestDataFactory.overdue({
        id: 2,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '4000.00',
      }),

      InvoiceTestDataFactory.overdue({
        id: 3,
        customer_id: CUSTOMER_2.id,
        customer: CUSTOMER_2,
        total: '2000.00',
      }),

      InvoiceTestDataFactory.unpaid({
        id: 4,
        customer_id: customer3.id,
        customer: customer3,
        total: '6000.00',
      }),
    ]
    const result = useCase.execute(invoices)
    expect(result.latePayers).toHaveLength(2)
    expect(result.latePayers).toEqual(
      expect.arrayContaining([
        { customerId: CUSTOMER_1.id, name: 'John Doe', lateCount: 2 },
        { customerId: CUSTOMER_2.id, name: 'Jane Smith', lateCount: 1 },
      ])
    )
    expect(result.largeOutstanding).toHaveLength(2)
    expect(result.largeOutstanding).toEqual(
      expect.arrayContaining([
        { customerId: CUSTOMER_1.id, name: 'John Doe', amount: 7000 },
        { customerId: customer3.id, name: 'Bob Wilson', amount: 6000 },
      ])
    )
  })

  it('should ignore paid invoices in calculations', () => {
    const invoices = [
      InvoiceTestDataFactory.paid({
        id: 1,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '10000.00',
      }),
      InvoiceTestDataFactory.overdue({
        id: 2,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '1000.00',
      }),
    ]
    const result = useCase.execute(invoices)
    expect(result.latePayers).toHaveLength(1)
    expect(result.latePayers[0]).toEqual({
      customerId: CUSTOMER_1.id,
      name: 'John Doe',
      lateCount: 1,
    })
    expect(result.largeOutstanding).toEqual([])
  })

  it('should aggregate multiple invoices per customer', () => {
    const invoices = [
      InvoiceTestDataFactory.unpaid({
        id: 1,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '2000.00',
      }),
      InvoiceTestDataFactory.unpaid({
        id: 2,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '3000.00',
      }),
      InvoiceTestDataFactory.unpaid({
        id: 3,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '1000.00',
      }),
    ]
    const result = useCase.execute(invoices)
    expect(result.latePayers).toEqual([])
    expect(result.largeOutstanding).toHaveLength(1)
    expect(result.largeOutstanding[0]).toEqual({
      customerId: CUSTOMER_1.id,
      name: 'John Doe',
      amount: 6000,
    })
  })
})
