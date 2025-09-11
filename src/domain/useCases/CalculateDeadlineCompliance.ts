import { Invoice } from '../../types';

export interface DeadlineData {
  dueSoon: Invoice[]; // Next 7, 15, 30 days
  overdue: Invoice[];
}

export class CalculateDeadlineCompliance {
  execute(invoices: Invoice[]): DeadlineData {
    const now = new Date();
    const dueSoon: Invoice[] = [];
    const overdue: Invoice[] = [];

    invoices.forEach(inv => {
      if (inv.paid || !inv.deadline) return;
      const deadline = new Date(inv.deadline);
      const daysDiff = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff < 0) {
        overdue.push(inv);
      } else if (daysDiff <= 30) {
        dueSoon.push(inv);
      }
    });

    return { dueSoon, overdue };
  }
}