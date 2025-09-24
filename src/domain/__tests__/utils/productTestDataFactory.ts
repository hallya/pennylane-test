import { faker } from '@faker-js/faker';
import { DomainProduct } from '../../types';

faker.seed(123);

export class ProductTestDataFactory {
  static create(overrides: Partial<DomainProduct> = {}): DomainProduct {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      label: faker.commerce.productName(),
      vat_rate: faker.helpers.arrayElement(['0', '5.5', '10', '20']),
      unit: faker.helpers.arrayElement(['hour', 'day', 'piece']),
      unit_price: faker.finance.amount(),
      unit_price_without_tax: faker.finance.amount(),
      unit_tax: faker.finance.amount(),
      ...overrides,
    };
  }
}