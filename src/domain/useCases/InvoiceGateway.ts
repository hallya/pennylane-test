import { DomainInvoice, DomainPaginatedInvoices, DomainInvoiceCreatePayload, DomainInvoiceUpdatePayload } from '../types';

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
  getAllInvoices(page?: number, perPage?: number, filters?: InvoiceFilters): Promise<DomainPaginatedInvoices>;
  getInvoice(id: number): Promise<DomainInvoice>;
  createInvoice(payload: DomainInvoiceCreatePayload): Promise<DomainInvoice>;
  updateInvoice(id: number, payload: DomainInvoiceUpdatePayload): Promise<DomainInvoice>;
  deleteInvoice(id: number): Promise<void>;
}