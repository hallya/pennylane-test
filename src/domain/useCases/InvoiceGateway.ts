import { Invoice } from '../../types';

export interface InvoiceGateway {
  getAllInvoices(): Promise<Invoice[]>;
}