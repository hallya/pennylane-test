import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CustomerGatewayImpl } from '../gateways/CustomerGatewayImpl'

describe('CustomerGatewayImpl', () => {
  let mockApi: any

  beforeEach(() => {
    mockApi = {
      getSearchCustomers: vi.fn(),
    }
  })

  it('should search customers successfully', async () => {
    const mockResponse = {
      data: {
        customers: [
          { id: 1, name: 'Customer 1' },
          { id: 2, name: 'Customer 2' },
        ],
      },
    }
    mockApi.getSearchCustomers.mockResolvedValue(mockResponse)

    const gateway = new CustomerGatewayImpl(mockApi)

    const result = await gateway.searchCustomers('test')

    expect(result).toEqual(mockResponse.data.customers)
    expect(mockApi.getSearchCustomers).toHaveBeenCalledWith({
      query: 'test',
      page: 1,
      per_page: 10,
    })
  })

  it('should handle API error', async () => {
    const error = new Error('API error')
    mockApi.getSearchCustomers.mockRejectedValue(error)

    const gateway = new CustomerGatewayImpl(mockApi)

    await expect(gateway.searchCustomers('test')).rejects.toThrow('API error')
  })

  it('should handle network timeout', async () => {
    const timeoutError = new Error('Timeout')
    mockApi.getSearchCustomers.mockRejectedValue(timeoutError)

    const gateway = new CustomerGatewayImpl(mockApi)

    await expect(gateway.searchCustomers('test')).rejects.toThrow('Timeout')
  })
})