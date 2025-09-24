import { DomainCustomer } from '../types';

export interface CustomerGateway {
  searchCustomers(query: string): Promise<DomainCustomer[]>;
}