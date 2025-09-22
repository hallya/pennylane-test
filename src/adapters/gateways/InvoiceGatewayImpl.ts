import { InvoiceGateway } from '../../domain/useCases';
import { Invoice, PaginatedInvoices } from '../../types';
import { Client, Components } from '../../api/gen/client';

export class InvoiceGatewayImpl implements InvoiceGateway {
  constructor(private api: Client) {}

  async getAllInvoices(page?: number, perPage?: number): Promise<PaginatedInvoices> {
    const params: any = {};
    if (page !== undefined) params.page = page;
    if (perPage !== undefined) params.per_page = perPage;
    const { data } = await this.api.getInvoices(params);
    return data;
  }

  async getInvoice(id: number): Promise<Invoice> {
    const { data } = await this.api.getInvoice(id);
    return data;
  }

  async createInvoice(payload: Components.Schemas.InvoiceCreatePayload): Promise<Invoice> {
    const { data } = await this.api.postInvoices(null, { invoice: payload });
    return data;
  }

  async updateInvoice(id: number, payload: Components.Schemas.InvoiceUpdatePayload): Promise<Invoice> {
    const { data } = await this.api.putInvoice(id, { invoice: payload });
    return data;
  }

  async deleteInvoice(id: number): Promise<void> {
    await this.api.deleteInvoice(id);
  }
}