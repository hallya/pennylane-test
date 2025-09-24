import { CustomerGateway } from '../../domain/useCases';
import { DomainCustomer } from '../../domain/types';
import { Client } from '../../domain/types/api';

export class CustomerGatewayImpl implements CustomerGateway {
  constructor(private api: Client) {}

  async searchCustomers(query: string): Promise<DomainCustomer[]> {
    const { data } = await this.api.getSearchCustomers({
      query,
      page: 1,
      per_page: 10
    });
    return data.customers;
  }
}