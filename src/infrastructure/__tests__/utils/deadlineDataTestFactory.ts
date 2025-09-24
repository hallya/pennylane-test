import { faker } from '@faker-js/faker'
import { DeadlineData } from '../../../domain/useCases'
import { InvoiceEntity } from '../../../domain/entities'
import { InvoiceTestDataFactory } from '../../../domain/__tests__/utils'

faker.seed(789)

export class DeadlineDataTestFactory {
  static create(overrides: Partial<DeadlineData> = {}): DeadlineData {
    const dueSoonInvoice = InvoiceTestDataFactory.dueSoon({
      total: faker.finance.amount(),
      tax: faker.finance.amount(),
    })

    const overdueInvoice = InvoiceTestDataFactory.overdue({
      total: faker.finance.amount(),
      tax: faker.finance.amount(),
    })

    return {
      dueSoon: [new InvoiceEntity(dueSoonInvoice)],
      overdue: [new InvoiceEntity(overdueInvoice)],
      ...overrides,
    }
  }

  static empty(): DeadlineData {
    return {
      dueSoon: [],
      overdue: [],
    }
  }

  static withDueSoonInvoices(count: number = 1): DeadlineData {
    const dueSoonInvoices = Array.from({ length: count }, () =>
      new InvoiceEntity(
        InvoiceTestDataFactory.dueSoon({
          total: faker.finance.amount(),
          tax: faker.finance.amount(),
        })
      )
    )

    return {
      dueSoon: dueSoonInvoices,
      overdue: [],
    }
  }

  static withOverdueInvoices(count: number = 1): DeadlineData {
    const overdueInvoices = Array.from({ length: count }, () =>
      new InvoiceEntity(
        InvoiceTestDataFactory.overdue({
          total: faker.finance.amount(),
          tax: faker.finance.amount(),
        })
      )
    )

    return {
      dueSoon: [],
      overdue: overdueInvoices,
    }
  }

  static withSpecificDueSoon(
    deadline: string,
    total: string
  ): DeadlineData {
    const invoice = new InvoiceEntity(
      InvoiceTestDataFactory.dueSoon({
        deadline,
        total,
        tax: faker.finance.amount(),
      })
    )

    return {
      dueSoon: [invoice],
      overdue: [],
    }
  }

  static withSpecificOverdue(
    deadline: string,
    total: string
  ): DeadlineData {
    const invoice = new InvoiceEntity(
      InvoiceTestDataFactory.overdue({
        deadline,
        total,
        tax: faker.finance.amount(),
      })
    )

    return {
      dueSoon: [],
      overdue: [invoice],
    }
  }

  static withInvoiceWithoutDeadline(total: string): DeadlineData {
    const invoice = new InvoiceEntity(
      InvoiceTestDataFactory.withoutDeadline({
        total,
        tax: faker.finance.amount(),
      })
    )

    return {
      dueSoon: [invoice],
      overdue: [],
    }
  }
}