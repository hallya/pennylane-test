import { DomainInvoice } from '../types';
import { InvoiceEntity } from '../entities';

export interface RevenueStructureData {
  byClient: { clientId: number; name: string; revenue: number }[];
  byProduct: { productId: number; label: string; revenue: number }[];
  byVatRate: { vatRate: string; revenue: number }[];
}

export class CalculateRevenueStructure {
  execute(invoices: DomainInvoice[]): RevenueStructureData {
    const byClient: { [key: number]: { name: string; revenue: number } } = {};
    const byProduct: { [key: number]: { label: string; revenue: number } } = {};
    const byVatRate: { [key: string]: number } = {};

    const invoiceEntities = invoices.map(inv => new InvoiceEntity(inv));

    invoiceEntities.forEach(inv => {
      if (!inv.finalized) return;
      const revenue = inv.getTotalAmount();

      // By client
      if (inv.customer_id && inv.customer) {
        const id = inv.customer_id;
        const name = `${inv.customer.first_name} ${inv.customer.last_name}`;
        byClient[id] = byClient[id] || { name, revenue: 0 };
        byClient[id].revenue += revenue;
      }

      // By product
      inv.invoice_lines?.forEach(line => {
        if (line.product_id && line.product) {
          const id = line.product_id;
          const label = line.product.label;
          byProduct[id] = byProduct[id] || { label, revenue: 0 };
          byProduct[id].revenue += parseFloat(line.price || '0') * (line.quantity || 1);
        }

        // By VAT
        const vat = line.vat_rate || '0';
        byVatRate[vat] = (byVatRate[vat] || 0) + parseFloat(line.tax || '0');
      });
    });

    return {
      byClient: Object.entries(byClient).map(([id, data]) => ({ clientId: parseInt(id), ...data })),
      byProduct: Object.entries(byProduct).map(([id, data]) => ({ productId: parseInt(id), ...data })),
      byVatRate: Object.entries(byVatRate).map(([vat, revenue]) => ({ vatRate: vat, revenue })),
    };
  }
}