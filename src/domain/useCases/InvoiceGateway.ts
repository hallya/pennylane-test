import { Invoice, PaginatedInvoices } from '../../types';
import { Components } from '../../api/gen/client';

export type FilterItem = {
  field: string;
  operator: string;
  value: string | number | boolean;
};

export interface InvoiceFilters {
  id?: number;
  customerId?: number;
  finalized?: boolean;
  paid?: boolean;
  year?: number;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  deadline?: string;
  deadlineFrom?: string;
  deadlineTo?: string;
}

export interface InvoiceGateway {
  getAllInvoices(page?: number, perPage?: number, filters?: InvoiceFilters): Promise<PaginatedInvoices>;
  getInvoice(id: number): Promise<Invoice>;
  createInvoice(payload: Components.Schemas.InvoiceCreatePayload): Promise<Invoice>;
  updateInvoice(id: number, payload: Components.Schemas.InvoiceUpdatePayload): Promise<Invoice>;
  deleteInvoice(id: number): Promise<void>;
}