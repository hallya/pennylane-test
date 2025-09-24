import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InvoiceGatewayImpl } from '../gateways/InvoiceGatewayImpl'
import { InvoiceTestDataFactory } from '../../domain/__tests__/utils'

describe('InvoiceGatewayImpl', () => {
  let mockApi: any

  beforeEach(() => {
    mockApi = {
      getInvoices: vi.fn(),
      getInvoice: vi.fn(),
      postInvoices: vi.fn(),
      putInvoice: vi.fn(),
      deleteInvoice: vi.fn(),
    }
  })

  const createMockResponse = (invoice: any) => ({
    data: {
      invoices: [invoice],
      pagination: { page: 1, page_size: 25, total_pages: 1, total_entries: 1 },
    },
  })

  describe('getAllInvoices', () => {
    it('should get all invoices', async () => {
      const mockInvoice = InvoiceTestDataFactory.create({ id: 1 })
      const mockResponse = createMockResponse(mockInvoice)
      mockApi.getInvoices.mockResolvedValue(mockResponse)

      const gateway = new InvoiceGatewayImpl(mockApi)

      const result = await gateway.getAllInvoices(1, 25)

      expect(result).toEqual(mockResponse.data)
      expect(mockApi.getInvoices).toHaveBeenCalledWith({
        page: 1,
        per_page: 25,
      })
    })

    it.each([
      [
        'customerId',
        { customerId: 123 },
        [{ field: 'customer_id', operator: 'eq', value: 123 }],
      ],
      ['id', { id: 456 }, [{ field: 'id', operator: 'eq', value: 456 }]],
      [
        'paid',
        { paid: false },
        [{ field: 'paid', operator: 'eq', value: false }],
      ],
      [
        'date',
        { date: '2023-05-15' },
        [{ field: 'date', operator: 'eq', value: '2023-05-15' }],
      ],
      [
        'dateFrom',
        { dateFrom: '2023-01-01' },
        [{ field: 'date', operator: 'gteq', value: '2023-01-01' }],
      ],
      [
        'dateTo',
        { dateTo: '2023-12-31' },
        [{ field: 'date', operator: 'lteq', value: '2023-12-31' }],
      ],
      [
        'deadline',
        { deadline: '2023-06-15' },
        [{ field: 'deadline', operator: 'eq', value: '2023-06-15' }],
      ],
      [
        'deadlineFrom',
        { deadlineFrom: '2023-01-01' },
        [{ field: 'deadline', operator: 'gteq', value: '2023-01-01' }],
      ],
      [
        'deadlineTo',
        { deadlineTo: '2023-12-31' },
        [{ field: 'deadline', operator: 'lteq', value: '2023-12-31' }],
      ],
      [
        'finalized',
        { finalized: true },
        [{ field: 'finalized', operator: 'eq', value: true }],
      ],
      [
        'year',
        { year: 2023 },
        [
          { field: 'date', operator: 'gteq', value: '2023-01-01' },
          { field: 'date', operator: 'lteq', value: '2023-12-31' },
        ],
      ],
      [
        'multiple',
        { customerId: 123, finalized: true, paid: false },
        [
          { field: 'customer_id', operator: 'eq', value: 123 },
          { field: 'finalized', operator: 'eq', value: true },
          { field: 'paid', operator: 'eq', value: false },
        ],
      ],
    ])(
      'should get invoices with %s filter',
      async (filterName, filterParams, expectedFilter) => {
        const mockInvoice = InvoiceTestDataFactory.create({ id: 1 })
        const mockResponse = createMockResponse(mockInvoice)
        mockApi.getInvoices.mockResolvedValue(mockResponse)

        const gateway = new InvoiceGatewayImpl(mockApi)

        const result = await gateway.getAllInvoices(1, 25, filterParams)

        expect(result).toEqual(mockResponse.data)
        expect(mockApi.getInvoices).toHaveBeenCalledWith({
          page: 1,
          per_page: 25,
          filter: JSON.stringify(expectedFilter),
        })
      }
    )

    it('should handle API error', async () => {
      const error = new Error('API error')
      mockApi.getInvoices.mockRejectedValue(error)

      const gateway = new InvoiceGatewayImpl(mockApi)

      await expect(gateway.getAllInvoices()).rejects.toThrow('API error')
    })
  })

  describe('getInvoice', () => {
    it('should get single invoice', async () => {
      const mockInvoice = InvoiceTestDataFactory.create({ id: 1 })
      const mockResponse = { data: mockInvoice }
      mockApi.getInvoice.mockResolvedValue(mockResponse)

      const gateway = new InvoiceGatewayImpl(mockApi)

      const result = await gateway.getInvoice(1)

      expect(result).toEqual(mockResponse.data)
      expect(mockApi.getInvoice).toHaveBeenCalledWith(1)
    })

    it('should handle API error', async () => {
      const error = new Error('API error')
      mockApi.getInvoice.mockRejectedValue(error)

      const gateway = new InvoiceGatewayImpl(mockApi)

      await expect(gateway.getInvoice(1)).rejects.toThrow('API error')
    })
  })

  describe('createInvoice', () => {
    it('should create invoice', async () => {
      const payload = { customer_id: 1, lines: [] }
      const mockInvoice = InvoiceTestDataFactory.create({ id: 1 })
      const mockResponse = { data: mockInvoice }
      mockApi.postInvoices.mockResolvedValue(mockResponse)

      const gateway = new InvoiceGatewayImpl(mockApi)

      const result = await gateway.createInvoice(payload)

      expect(result).toEqual(mockResponse.data)
      expect(mockApi.postInvoices).toHaveBeenCalledWith(null, {
        invoice: payload,
      })
    })

    it('should handle API error', async () => {
      const payload = { customer_id: 1, lines: [] }
      const error = new Error('API error')
      mockApi.postInvoices.mockRejectedValue(error)

      const gateway = new InvoiceGatewayImpl(mockApi)

      await expect(gateway.createInvoice(payload)).rejects.toThrow('API error')
    })
  })

  describe('updateInvoice', () => {
    it('should update invoice', async () => {
      const payload = { id: 1, customer_id: 1 }
      const mockInvoice = InvoiceTestDataFactory.create({ id: 1 })
      const mockResponse = { data: mockInvoice }
      mockApi.putInvoice.mockResolvedValue(mockResponse)

      const gateway = new InvoiceGatewayImpl(mockApi)

      const result = await gateway.updateInvoice(1, payload)

      expect(result).toEqual(mockResponse.data)
      expect(mockApi.putInvoice).toHaveBeenCalledWith(1, { invoice: payload })
    })

    it('should handle API error', async () => {
      const payload = { id: 1, customer_id: 1 }
      const error = new Error('API error')
      mockApi.putInvoice.mockRejectedValue(error)

      const gateway = new InvoiceGatewayImpl(mockApi)

      await expect(gateway.updateInvoice(1, payload)).rejects.toThrow(
        'API error'
      )
    })
  })

  describe('deleteInvoice', () => {
    it('should delete invoice', async () => {
      mockApi.deleteInvoice.mockResolvedValue(undefined)

      const gateway = new InvoiceGatewayImpl(mockApi)

      await gateway.deleteInvoice(1)

      expect(mockApi.deleteInvoice).toHaveBeenCalledWith(1)
    })

    it('should handle API error', async () => {
      const error = new Error('API error')
      mockApi.deleteInvoice.mockRejectedValue(error)

      const gateway = new InvoiceGatewayImpl(mockApi)

      await expect(gateway.deleteInvoice(1)).rejects.toThrow('API error')
    })
  })
})
