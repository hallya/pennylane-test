import { Components } from '../../api/gen/client';

export interface CustomerGateway {
  searchCustomers(query: string): Promise<Components.Schemas.Customer[]>;
}