import { InvoiceGateway } from '../../domain/useCases';
import { Invoice } from '../../types';
import { Client } from '../../api/gen/client';

export class InvoiceGatewayImpl implements InvoiceGateway {
  constructor(private api: Client) {}

  async getAllInvoices(): Promise<Invoice[]> {
    const { data } = await this.api.getInvoices();
    return data.invoices;
  }
}