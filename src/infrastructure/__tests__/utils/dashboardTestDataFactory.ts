import { faker } from '@faker-js/faker'
import {
  RevenueStructureData,
  CashFlowData,
  ClientReliabilityData,
  DeadlineData,
  DashboardData,
} from '../../../domain/useCases'
import { InvoiceWithCustomerTestDataFactory } from '../../../domain/__tests__/utils'

faker.seed(456)

export class DashboardTestDataFactory {
  static createRevenueStructureData(
    overrides: Partial<RevenueStructureData> = {}
  ): RevenueStructureData {
    return {
      byClient: [
        { clientId: 1, name: 'Client A', revenue: 15000 },
        { clientId: 2, name: 'Client B', revenue: 12000 },
        { clientId: 3, name: 'Client C', revenue: 10000 },
        { clientId: 4, name: 'Client D', revenue: 8000 },
        { clientId: 5, name: 'Client E', revenue: 6000 },
        { clientId: 6, name: 'Client F', revenue: 4000 },
      ],
      byProduct: [
        { productId: 1, label: 'Product A', revenue: 20000 },
        { productId: 2, label: 'Product B', revenue: 15000 },
        { productId: 3, label: 'Product C', revenue: 10000 },
      ],
      byVatRate: [
        { vatRate: '20', revenue: 25000 },
        { vatRate: '10', revenue: 15000 },
        { vatRate: '5.5', revenue: 5000 },
      ],
      ...overrides,
    }
  }

  static createCashFlowData(
    overrides: Partial<CashFlowData> = {}
  ): CashFlowData {
    return {
      totalIssued: 50000,
      totalReceived: 35000,
      outstandingReceivables: 15000,
      dso: 25,
      isAtRisk: false,
      ...overrides,
    }
  }

  static createClientReliabilityData(
    overrides: Partial<ClientReliabilityData> = {}
  ): ClientReliabilityData {
    return {
      latePayers: [
        { customerId: 1, name: 'Client A', lateCount: 3 },
        { customerId: 2, name: 'Client B', lateCount: 1 },
      ],
      largeOutstanding: [
        { customerId: 1, name: 'Client A', amount: 25000 },
        { customerId: 3, name: 'Client C', amount: 20000 },
      ],
      ...overrides,
    }
  }

  static createDeadlineData(
    overrides: Partial<DeadlineData> = {}
  ): DeadlineData {
    const invoice1 =
      InvoiceWithCustomerTestDataFactory.createOverdueInvoiceWithCustomer({
        customer: { first_name: 'John', last_name: 'Doe' },
        invoice: { id: 1, total: '1000', tax: '200' },
      })

    const invoice2 =
      InvoiceWithCustomerTestDataFactory.createDueSoonInvoiceWithCustomer({
        customer: { first_name: 'Jane', last_name: 'Smith' },
        invoice: { id: 2, total: '2000', tax: '400' },
      })

    return {
      overdue: [invoice1],
      dueSoon: [invoice2],
      ...overrides,
    }
  }

  static createDashboardData(
    overrides: Partial<DashboardData> = {}
  ): DashboardData {
    return {
      cashFlow: this.createCashFlowData(),
      deadlineCompliance: this.createDeadlineData(),
      clientReliability: this.createClientReliabilityData(),
      revenueStructure: this.createRevenueStructureData(),
      ...overrides,
    }
  }

  static createEmptyRevenueStructureData(): RevenueStructureData {
    return {
      byClient: [],
      byProduct: [],
      byVatRate: [],
    }
  }

  static createRevenueStructureDataWithFewClients(): RevenueStructureData {
    return this.createRevenueStructureData({
      byClient: [
        { clientId: 1, name: 'Client A', revenue: 15000 },
        { clientId: 2, name: 'Client B', revenue: 12000 },
      ],
    })
  }
}
