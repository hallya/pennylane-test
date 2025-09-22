import { CustomerGateway } from '../../domain/useCases';
import { Client, Components } from '../../api/gen/client';

export class CustomerGatewayImpl implements CustomerGateway {
  constructor(private api: Client) {}

  async searchCustomers(query: string): Promise<Components.Schemas.Customer[]> {
    const { data } = await this.api.getSearchCustomers({
      query,
      page: 1,
      per_page: 10
    });
    return data.customers;
  }
}