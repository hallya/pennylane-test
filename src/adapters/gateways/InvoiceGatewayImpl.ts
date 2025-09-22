import { InvoiceGateway } from '../../domain/useCases';
import { Invoice } from '../../types';
import { Client, Components } from '../../api/gen/client';

export class InvoiceGatewayImpl implements InvoiceGateway {
  constructor(private api: Client) {}

  async getAllInvoices(): Promise<Invoice[]> {
    const { data } = await this.api.getInvoices();
    return data.invoices;
  }

  async createInvoice(payload: Components.Schemas.InvoiceCreatePayload): Promise<Invoice> {
    const { data } = await this.api.postInvoices(null, { invoice: payload });
    return data;
  }
}