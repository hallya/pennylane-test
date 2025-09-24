import { DomainCustomer } from '../types';
import { CustomerGateway } from './CustomerGateway';

export interface SearchCustomersUseCase {
  execute(query: string): Promise<DomainCustomer[]>;
}

export class SearchCustomersUseCaseImpl implements SearchCustomersUseCase {
  constructor(private customerGateway: CustomerGateway) {}

  async execute(query: string): Promise<DomainCustomer[]> {
    if (query.length < 3) {
      return [];
    }
    return await this.customerGateway.searchCustomers(query);
  }
}