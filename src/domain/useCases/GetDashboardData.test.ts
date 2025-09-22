import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest'
import { GetDashboardData } from './GetDashboardData'
import { InvoiceGateway } from './InvoiceGateway'
import { CalculateCashFlow } from './CalculateCashFlow'
import { CalculateDeadlineCompliance } from './CalculateDeadlineCompliance'
import { CalculateClientReliability } from './CalculateClientReliability'
import { CalculateRevenueStructure } from './CalculateRevenueStructure'
import { InvoiceTestDataFactory } from '../__tests__/utils/invoiceTestDataFactory'

const mockInvoiceGateway: Mocked<InvoiceGateway> = {
  getAllInvoices: vi.fn(),
  createInvoice: vi.fn(),
  deleteInvoice: vi.fn(),
}

const mockCalculateCashFlow: Mocked<CalculateCashFlow> = {
  execute: vi.fn(),
}

const mockCalculateDeadlineCompliance: Mocked<CalculateDeadlineCompliance> = {
  execute: vi.fn(),
}

const mockCalculateClientReliability: Mocked<CalculateClientReliability> = {
  execute: vi.fn(),
}

const mockCalculateRevenueStructure: Mocked<CalculateRevenueStructure> = {
  execute: vi.fn(),
}

const mockInvoices = [InvoiceTestDataFactory.create()]
const mockPaginatedInvoices = {
  pagination: { page: 1, page_size: 10000, total_pages: 1, total_entries: 1 },
  invoices: mockInvoices,
}
const mockCashFlowData = {
  totalIssued: 1000,
  totalReceived: 500,
  outstandingReceivables: 500,
  dso: 15,
  isAtRisk: false,
}
const mockDeadlineData = {
  dueSoon: [],
  overdue: [],
}
const mockClientReliabilityData = {
  latePayers: [],
  largeOutstanding: [],
}
const mockRevenueStructureData = {
  byClient: [],
  byProduct: [],
  byVatRate: [],
}

describe('GetDashboardData', () => {
  let useCase: GetDashboardData

  beforeEach(() => {
    vi.clearAllMocks()

    mockInvoiceGateway.getAllInvoices.mockResolvedValue(mockPaginatedInvoices)
    mockCalculateCashFlow.execute.mockReturnValue(mockCashFlowData)
    mockCalculateDeadlineCompliance.execute.mockReturnValue(mockDeadlineData)
    mockCalculateClientReliability.execute.mockReturnValue(
      mockClientReliabilityData
    )
    mockCalculateRevenueStructure.execute.mockReturnValue(
      mockRevenueStructureData
    )

    useCase = new GetDashboardData(
      mockInvoiceGateway,
      mockCalculateCashFlow,
      mockCalculateDeadlineCompliance,
      mockCalculateClientReliability,
      mockCalculateRevenueStructure
    )
  })

  it('should call getAllInvoices on the gateway', async () => {
    await useCase.execute()
    expect(mockInvoiceGateway.getAllInvoices).toHaveBeenCalledTimes(1)
  })

  it('should call all calculate use cases with the invoices', async () => {
    await useCase.execute()
    expect(mockCalculateCashFlow.execute).toHaveBeenCalledWith(mockInvoices)
    expect(mockCalculateDeadlineCompliance.execute).toHaveBeenCalledWith(
      mockInvoices
    )
    expect(mockCalculateClientReliability.execute).toHaveBeenCalledWith(
      mockInvoices
    )
    expect(mockCalculateRevenueStructure.execute).toHaveBeenCalledWith(
      mockInvoices
    )
  })

  it('should return combined dashboard data', async () => {
    const result = await useCase.execute()
    expect(result).toEqual({
      cashFlow: mockCashFlowData,
      deadlineCompliance: mockDeadlineData,
      clientReliability: mockClientReliabilityData,
      revenueStructure: mockRevenueStructureData,
    })
  })


  it('should handle gateway errors', async () => {
    const error = new Error('Gateway error')
    mockInvoiceGateway.getAllInvoices.mockRejectedValue(error)

    await expect(useCase.execute()).rejects.toThrow('Gateway error')
  })

  it('should handle calculation errors', async () => {
    const error = new Error('Calculation error')
    mockCalculateCashFlow.execute.mockImplementation(() => {
      throw error
    })

    await expect(useCase.execute()).rejects.toThrow('Calculation error')
  })

  it('should call use cases in correct order', async () => {
    const callOrder: string[] = []

    mockInvoiceGateway.getAllInvoices.mockImplementation(async () => {
      callOrder.push('gateway')
      return mockPaginatedInvoices
    })

    mockCalculateCashFlow.execute.mockImplementation(() => {
      callOrder.push('cashFlow')
      return mockCashFlowData
    })

    mockCalculateDeadlineCompliance.execute.mockImplementation(() => {
      callOrder.push('deadline')
      return mockDeadlineData
    })

    mockCalculateClientReliability.execute.mockImplementation(() => {
      callOrder.push('clientReliability')
      return mockClientReliabilityData
    })

    mockCalculateRevenueStructure.execute.mockImplementation(() => {
      callOrder.push('revenueStructure')
      return mockRevenueStructureData
    })

    await useCase.execute()

    expect(callOrder).toEqual([
      'gateway',
      'cashFlow',
      'deadline',
      'clientReliability',
      'revenueStructure',
    ])
  })
})
