import { Invoice, PaginatedInvoices } from '../../types';
import { Components } from '../../api/gen/client';

export interface InvoiceGateway {
  getAllInvoices(page?: number, perPage?: number): Promise<PaginatedInvoices>;
  getFinalizedInvoices(page?: number, perPage?: number): Promise<PaginatedInvoices>;
  getInvoice(id: number): Promise<Invoice>;
  createInvoice(payload: Components.Schemas.InvoiceCreatePayload): Promise<Invoice>;
  updateInvoice(id: number, payload: Components.Schemas.InvoiceUpdatePayload): Promise<Invoice>;
  deleteInvoice(id: number): Promise<void>;
}