import { Invoice } from '../../types';
import { InvoiceEntity } from '../entities';
import { DSO_DAYS_PERIOD, AT_RISK_DSO_DAYS_THRESHOLD, AT_RISK_OUTSTANDING_EUROS_THRESHOLD } from '../constants';

export interface CashFlowData {
  totalIssued: number;
  totalReceived: number;
  outstandingReceivables: number;
  dso: number;
  isAtRisk: boolean;
}

export class CalculateCashFlow {
  execute(invoices: Invoice[]): CashFlowData {
    const invoiceEntities = invoices.map(inv => new InvoiceEntity(inv));

    const totalIssued = invoiceEntities.reduce((sum, inv) => sum + inv.getTotalAmount(), 0);
    const totalReceived = invoiceEntities
      .filter(inv => inv.paid)
      .reduce((sum, inv) => sum + inv.getTotalAmount(), 0);
    const outstandingReceivables = invoiceEntities.reduce((sum, inv) => sum + inv.getOutstandingAmount(), 0);

    const dso = totalIssued > 0 ? (outstandingReceivables / totalIssued) * DSO_DAYS_PERIOD : 0;
    const isAtRisk = dso > AT_RISK_DSO_DAYS_THRESHOLD || outstandingReceivables > AT_RISK_OUTSTANDING_EUROS_THRESHOLD;

    return {
      totalIssued,
      totalReceived,
      outstandingReceivables,
      dso,
      isAtRisk,
    };
  }
}