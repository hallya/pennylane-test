import { faker } from '@faker-js/faker';
import { InvoiceLine, Product } from '../../../types';

faker.seed(123);

export class InvoiceLineTestDataFactory {
  static create(overrides: Partial<InvoiceLine> = {}): InvoiceLine {
    const product: Product = {
      id: faker.number.int({ min: 1, max: 1000 }),
      label: faker.commerce.productName(),
      vat_rate: faker.helpers.arrayElement(['0', '5.5', '10', '20']),
      unit: faker.helpers.arrayElement(['hour', 'day', 'piece']),
      unit_price: faker.finance.amount(),
      unit_price_without_tax: faker.finance.amount(),
      unit_tax: faker.finance.amount(),
      ...overrides.product,
    };

    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      invoice_id: faker.number.int({ min: 1, max: 1000 }),
      product_id: product.id,
      quantity: faker.number.int({ min: 1, max: 10 }),
      label: faker.commerce.productName(),
      unit: faker.helpers.arrayElement(['hour', 'day', 'piece']),
      vat_rate: faker.helpers.arrayElement(['0', '5.5', '10', '20']),
      price: faker.finance.amount(),
      tax: faker.finance.amount(),
      product,
      ...overrides,
    };
  }
}