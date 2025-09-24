import { DomainCustomer } from '../types';

export class CustomerEntity implements DomainCustomer {
  id: number;
  first_name: string;
  last_name: string;
  address: string;
  zip_code: string;
  city: string;
  country: string;
  country_code: string;

  constructor(data: DomainCustomer) {
    this.id = data.id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.address = data.address;
    this.zip_code = data.zip_code;
    this.city = data.city;
    this.country = data.country;
    this.country_code = data.country_code;
  }

  getFullName(): string {
    return `${this.first_name} ${this.last_name}`.trim();
  }
}