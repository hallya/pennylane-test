import { Invoice } from '../../types';

export interface ClientReliabilityData {
  latePayers: { customerId: number; name: string; lateCount: number }[];
  largeOutstanding: { customerId: number; name: string; amount: number }[];
}

export class CalculateClientReliability {
  execute(invoices: Invoice[]): ClientReliabilityData {
    const customerStats: { [key: number]: { name: string; late: number; outstanding: number } } = {};

    invoices.forEach(inv => {
      if (!inv.customer_id || !inv.customer) return;
      const id = inv.customer_id;
      const name = `${inv.customer.first_name} ${inv.customer.last_name}`;

      if (!customerStats[id]) {
        customerStats[id] = { name, late: 0, outstanding: 0 };
      }

      if (!inv.paid && inv.deadline && new Date(inv.deadline) < new Date()) {
        customerStats[id].late++;
      }

      if (!inv.paid && inv.total) {
        customerStats[id].outstanding += parseFloat(inv.total);
      }
    });

    const latePayers = Object.entries(customerStats)
      .filter(([, stats]) => stats.late > 0)
      .map(([id, stats]) => ({ customerId: parseInt(id), name: stats.name, lateCount: stats.late }));

    const largeOutstanding = Object.entries(customerStats)
      .filter(([, stats]) => stats.outstanding > 5000) // Threshold
      .map(([id, stats]) => ({ customerId: parseInt(id), name: stats.name, amount: stats.outstanding }));

    return { latePayers, largeOutstanding };
  }
}