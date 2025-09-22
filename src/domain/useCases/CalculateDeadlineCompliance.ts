import { Invoice } from '../../types';
import { InvoiceEntity } from '../entities';

export interface DeadlineData {
  dueSoon: InvoiceEntity[];
  overdue: InvoiceEntity[];
}

export class CalculateDeadlineCompliance {
  execute(invoices: Invoice[]): DeadlineData {
    const invoiceEntities = invoices.map(inv => new InvoiceEntity(inv));
    const dueSoon: InvoiceEntity[] = [];
    const overdue: InvoiceEntity[] = [];

    invoiceEntities.forEach(inv => {
      if (inv.paid || !inv.deadline) return;

      if (inv.isOverdue()) {
        overdue.push(inv);
      } else if (inv.isDueSoon()) {
          dueSoon.push(inv);
      }
    });

    return { dueSoon, overdue };
  }
}