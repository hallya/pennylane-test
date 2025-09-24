import type { Components, Paths } from './api';

export type DomainCustomer = Components.Schemas.Customer;
export type DomainInvoice = Paths.GetInvoices.Responses.$200['invoices'][0];
export type DomainInvoiceLine = Components.Schemas.InvoiceLine;
export type DomainProduct = Components.Schemas.Product;
export type DomainPagination = Components.Schemas.Pagination;
export type DomainPaginatedInvoices = Paths.GetInvoices.Responses.$200;
export type DomainInvoiceCreatePayload = Components.Schemas.InvoiceCreatePayload;
export type DomainInvoiceUpdatePayload = Components.Schemas.InvoiceUpdatePayload;