import { faker } from '@faker-js/faker';
import { DomainCustomer } from '../../types';

faker.seed(123);

export class CustomerTestDataFactory {
  static create(overrides: Partial<DomainCustomer> = {}): DomainCustomer {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      address: faker.location.streetAddress(),
      zip_code: faker.location.zipCode(),
      city: faker.location.city(),
      country: faker.location.country(),
      country_code: faker.location.countryCode(),
      ...overrides,
    };
  }
}