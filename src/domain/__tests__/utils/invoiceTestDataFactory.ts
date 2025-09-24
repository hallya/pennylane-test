import { faker } from '@faker-js/faker'
import { DomainInvoice } from '../../types'

faker.seed(123)

export class InvoiceTestDataFactory {
  static create(overrides: Partial<DomainInvoice> = {}): DomainInvoice {
    const id = overrides.id || faker.number.int({ min: 1, max: 1000 })
    const total = overrides.total || faker.finance.amount()
    const tax = overrides.tax || faker.finance.amount()

    return {
      id,
      customer_id: faker.number.int({ min: 1, max: 100 }),
      finalized: true,
      paid: false,
      date: faker.date.past().toISOString().split('T')[0],
      deadline: faker.date.future().toISOString().split('T')[0],
      total,
      tax,
      customer: undefined,
      invoice_lines: overrides.invoice_lines || [
        {
          id: faker.number.int({ min: 1, max: 1000 }),
          invoice_id: id,
          product_id: faker.number.int({ min: 1, max: 100 }),
          quantity: 1,
          label: faker.commerce.productName(),
          unit: faker.helpers.arrayElement(['hour', 'day', 'piece']),
          vat_rate: faker.helpers.arrayElement(['0', '5.5', '10', '20']),
          price: total,
          tax,
          product: {
            id: faker.number.int({ min: 1, max: 1000 }),
            label: faker.commerce.productName(),
            vat_rate: faker.helpers.arrayElement(['0', '5.5', '10', '20']),
            unit: faker.helpers.arrayElement(['hour', 'day', 'piece']),
            unit_price: total,
            unit_price_without_tax: (parseFloat(total) - parseFloat(tax)).toFixed(2),
            unit_tax: tax,
          },
        },
      ],
      ...overrides,
    }
  }

  static paid(overrides: Partial<DomainInvoice> = {}): DomainInvoice {
    return this.create({ paid: true, ...overrides })
  }

  static unpaid(overrides: Partial<DomainInvoice> = {}): DomainInvoice {
    return this.create({ paid: false, ...overrides })
  }

  static overdue(overrides: Partial<DomainInvoice> = {}): DomainInvoice {
    const pastDate = faker.date.past({ years: 1 }).toISOString().split('T')[0]
    return this.create({ deadline: pastDate, ...overrides })
  }

  static dueSoon(overrides: Partial<DomainInvoice> = {}): DomainInvoice {
    const futureDate = faker.date.soon({ days: 15 }).toISOString().split('T')[0]
    return this.create({ deadline: futureDate, ...overrides })
  }

  static future(overrides: Partial<DomainInvoice> = {}): DomainInvoice {
    const futureDate = faker.date
      .future({ years: 1 })
      .toISOString()
      .split('T')[0]
    return this.create({ deadline: futureDate, ...overrides })
  }

  static withoutDeadline(overrides: Partial<DomainInvoice> = {}): DomainInvoice {
    return this.create({ deadline: null, ...overrides })
  }
}
