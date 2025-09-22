import { Invoice, PaginatedInvoices } from '../../types';
import { Components } from '../../api/gen/client';

export interface InvoiceGateway {
  getAllInvoices(page?: number, perPage?: number): Promise<PaginatedInvoices>;
  createInvoice(payload: Components.Schemas.InvoiceCreatePayload): Promise<Invoice>;
  deleteInvoice(id: number): Promise<void>;
}