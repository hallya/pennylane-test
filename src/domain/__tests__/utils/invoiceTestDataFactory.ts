import { faker } from '@faker-js/faker';
import { Invoice } from '../../../types';

// Set seed for reproducible tests
faker.seed(123);

export class InvoiceTestDataFactory {
  static create(overrides: Partial<Invoice> = {}): Invoice {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      customer_id: faker.number.int({ min: 1, max: 100 }),
      finalized: true, // Default to true for most tests
      paid: false, // Default to false
      date: faker.date.past().toISOString().split('T')[0],
      deadline: faker.date.future().toISOString().split('T')[0],
      total: faker.finance.amount(),
      tax: faker.finance.amount(),
      invoice_lines: [],
      ...overrides,
    };
  }

  static paid(overrides: Partial<Invoice> = {}): Invoice {
    return this.create({ paid: true, ...overrides });
  }

  static unpaid(overrides: Partial<Invoice> = {}): Invoice {
    return this.create({ paid: false, ...overrides });
  }

  static overdue(overrides: Partial<Invoice> = {}): Invoice {
    const pastDate = faker.date.past({ years: 1 }).toISOString().split('T')[0];
    return this.create({ deadline: pastDate, ...overrides });
  }

  static dueSoon(overrides: Partial<Invoice> = {}): Invoice {
    const futureDate = faker.date.soon({ days: 15 }).toISOString().split('T')[0];
    return this.create({ deadline: futureDate, ...overrides });
  }

  static future(overrides: Partial<Invoice> = {}): Invoice {
    const futureDate = faker.date.future({ years: 1 }).toISOString().split('T')[0];
    return this.create({ deadline: futureDate, ...overrides });
  }

  static withoutDeadline(overrides: Partial<Invoice> = {}): Invoice {
    return this.create({ deadline: null, ...overrides });
  }
}