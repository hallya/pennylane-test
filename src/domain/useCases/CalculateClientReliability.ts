import { Invoice } from '../../types';
import { InvoiceEntity } from '../entities';
import { LARGE_OUTSTANDING_EUROS_THRESHOLD } from '../constants';

export interface ClientReliabilityData {
  latePayers: { customerId: number; name: string; lateCount: number }[];
  largeOutstanding: { customerId: number; name: string; amount: number }[];
}

export class CalculateClientReliability {
  execute(invoices: Invoice[]): ClientReliabilityData {
    const customerStats: { [key: number]: { name: string; late: number; outstanding: number } } = {};

    const invoiceEntities = invoices.map(inv => new InvoiceEntity(inv));

    invoiceEntities.forEach(inv => {
      if (!inv.customer_id || !inv.customer) return;
      const id = inv.customer_id;
      const name = `${inv.customer.first_name} ${inv.customer.last_name}`;

      if (!customerStats[id]) {
        customerStats[id] = { name, late: 0, outstanding: 0 };
      }

      if (inv.isOverdue()) {
        customerStats[id].late++;
      }

      customerStats[id].outstanding += inv.getOutstandingAmount();
    });

    const latePayers = Object.entries(customerStats)
      .filter(([, stats]) => stats.late > 0)
      .map(([id, stats]) => ({ customerId: parseInt(id), name: stats.name, lateCount: stats.late }));

    const largeOutstanding = Object.entries(customerStats)
      .filter(([, stats]) => stats.outstanding > LARGE_OUTSTANDING_EUROS_THRESHOLD)
      .map(([id, stats]) => ({ customerId: parseInt(id), name: stats.name, amount: stats.outstanding }));

    return { latePayers, largeOutstanding };
  }
}