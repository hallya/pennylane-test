import { InvoiceGateway } from './InvoiceGateway';
import { CalculateCashFlow, CashFlowData } from './CalculateCashFlow';
import { CalculateDeadlineCompliance, DeadlineData } from './CalculateDeadlineCompliance';
import { CalculateClientReliability, ClientReliabilityData } from './CalculateClientReliability';
import { CalculateRevenueStructure, RevenueStructureData } from './CalculateRevenueStructure';

export interface DashboardData {
  cashFlow: CashFlowData;
  deadlineCompliance: DeadlineData;
  clientReliability: ClientReliabilityData;
  revenueStructure: RevenueStructureData;
}

export class GetDashboardData {
  constructor(
    private invoiceGateway: InvoiceGateway,
    private calculateCashFlow: CalculateCashFlow,
    private calculateDeadlineCompliance: CalculateDeadlineCompliance,
    private calculateClientReliability: CalculateClientReliability,
    private calculateRevenueStructure: CalculateRevenueStructure
  ) {}

  async execute(): Promise<DashboardData> {
    const invoices = await this.invoiceGateway.getAllInvoices();

    return {
      cashFlow: this.calculateCashFlow.execute(invoices),
      deadlineCompliance: this.calculateDeadlineCompliance.execute(invoices),
      clientReliability: this.calculateClientReliability.execute(invoices),
      revenueStructure: this.calculateRevenueStructure.execute(invoices),
    };
  }
}