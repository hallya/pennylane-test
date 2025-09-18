import { InvoiceTestDataFactory } from './invoiceTestDataFactory'
import { CustomerTestDataFactory } from './customerTestDataFactory'
import { InvoiceEntity } from '../../entities'

export class InvoiceWithCustomerTestDataFactory {
  static createOverdueInvoiceWithCustomer(overrides: {
    invoice?: Partial<Parameters<typeof InvoiceTestDataFactory.overdue>[0]>
    customer?: Partial<Parameters<typeof CustomerTestDataFactory.create>[0]>
  } = {}) {
    const customer = CustomerTestDataFactory.create(overrides.customer)
    const invoice = InvoiceTestDataFactory.overdue({
      customer_id: customer.id,
      customer,
      ...overrides.invoice,
    })

    return new InvoiceEntity(invoice)
  }

  static createDueSoonInvoiceWithCustomer(overrides: {
    invoice?: Partial<Parameters<typeof InvoiceTestDataFactory.dueSoon>[0]>
    customer?: Partial<Parameters<typeof CustomerTestDataFactory.create>[0]>
  } = {}) {
    const customer = CustomerTestDataFactory.create(overrides.customer)
    const invoice = InvoiceTestDataFactory.dueSoon({
      customer_id: customer.id,
      customer,
      ...overrides.invoice,
    })

    return new InvoiceEntity(invoice)
  }

  static createPaidInvoiceWithCustomer(overrides: {
    invoice?: Partial<Parameters<typeof InvoiceTestDataFactory.paid>[0]>
    customer?: Partial<Parameters<typeof CustomerTestDataFactory.create>[0]>
  } = {}) {
    const customer = CustomerTestDataFactory.create(overrides.customer)
    const invoice = InvoiceTestDataFactory.paid({
      customer_id: customer.id,
      customer,
      ...overrides.invoice,
    })

    return new InvoiceEntity(invoice)
  }
}