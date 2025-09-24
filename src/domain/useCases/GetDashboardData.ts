import { InvoiceGateway, InvoiceFilters } from './InvoiceGateway';
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

  async execute(year?: number): Promise<DashboardData> {
    const filters: InvoiceFilters = {
      finalized: true,
    };
    if (year !== undefined) {
      filters.year = year;
    }

    const result = await this.invoiceGateway.getAllInvoices(1, 50, filters);
    const invoices = result.invoices;

    return {
      cashFlow: this.calculateCashFlow.execute(invoices),
      deadlineCompliance: this.calculateDeadlineCompliance.execute(invoices),
      clientReliability: this.calculateClientReliability.execute(invoices),
      revenueStructure: this.calculateRevenueStructure.execute(invoices),
    };
  }
}