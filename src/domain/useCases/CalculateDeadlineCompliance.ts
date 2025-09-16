import { Invoice } from '../../types';
import { InvoiceEntity } from '../entities';

export interface DeadlineData {
  dueSoon: InvoiceEntity[]; // Next 7, 15, 30 days
  overdue: InvoiceEntity[];
}

export class CalculateDeadlineCompliance {
  execute(invoices: Invoice[], days: number = 7): DeadlineData {
    console.log('CalculateDeadlineCompliance invoices:', invoices);
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