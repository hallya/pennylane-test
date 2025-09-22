import { Components } from '../../api/gen/client';
import { CustomerGateway } from './CustomerGateway';

export interface SearchCustomersUseCase {
  execute(query: string): Promise<Components.Schemas.Customer[]>;
}

export class SearchCustomersUseCaseImpl implements SearchCustomersUseCase {
  constructor(private customerGateway: CustomerGateway) {}

  async execute(query: string): Promise<Components.Schemas.Customer[]> {
    if (query.length < 3) {
      return [];
    }
    return await this.customerGateway.searchCustomers(query);
  }
}