import { Invoice } from '../../types';
import { Components } from '../../api/gen/client';

export interface InvoiceGateway {
  getAllInvoices(): Promise<Invoice[]>;
  createInvoice(payload: Components.Schemas.InvoiceCreatePayload): Promise<Invoice>;
}