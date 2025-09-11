import { Invoice } from '../../types';

export interface CashFlowData {
  totalIssued: number;
  totalReceived: number;
  outstandingReceivables: number;
  dso: number;
  isAtRisk: boolean;
}

export class CalculateCashFlow {
  execute(invoices: Invoice[]): CashFlowData {
    const totalIssued = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total || '0')), 0);
    const totalReceived = invoices
      .filter(inv => inv.paid)
      .reduce((sum, inv) => sum + (parseFloat(inv.total || '0')), 0);
    const outstandingReceivables = totalIssued - totalReceived;

    // DSO = (outstanding / total issued) * number of days (assume 30)
    const dso = totalIssued > 0 ? (outstandingReceivables / totalIssued) * 30 : 0;
    const isAtRisk = dso > 30 || outstandingReceivables > 10000; // Arbitrary threshold

    return {
      totalIssued,
      totalReceived,
      outstandingReceivables,
      dso,
      isAtRisk,
    };
  }
}