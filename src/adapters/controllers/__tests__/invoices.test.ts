import { renderHook, waitFor, act } from '@testing-library/react'
import { useCreateInvoice } from '../invoices/useCreateInvoice'
import { useUpdateInvoice } from '../invoices/useUpdateInvoice'
import { useDeleteInvoice } from '../invoices/useDeleteInvoice'
import { useGetInvoice } from '../invoices/useGetInvoice'
import { useInvoices } from '../invoices/useInvoices'
import { InvoiceEntity } from '../../../domain/entities'
import { AxiosError } from 'openapi-client-axios'
import { useApi } from '../../../infrastructure/api'
import { useToast } from '../../../infrastructure/components/hooks/useToast'
import { InvoiceGatewayImpl } from '../../gateways'
import { InvoiceTestDataFactory } from '../../../domain/__tests__/utils'

vi.mock('../../../infrastructure/api', () => ({
  useApi: vi.fn(),
}))

vi.mock('../../../infrastructure/components/hooks/useToast', () => ({
  useToast: vi.fn(),
}))

vi.mock('../../gateways', () => ({
  InvoiceGatewayImpl: vi.fn(),
}))

describe('Invoice Hooks', () => {
  let mockApi: any
  let mockShowToast: any
  let mockGateway: any

  beforeEach(() => {
    mockApi = {
      postInvoices: vi.fn(),
      putInvoice: vi.fn(),
      deleteInvoice: vi.fn(),
      getInvoice: vi.fn(),
      getInvoices: vi.fn(),
    }
    mockShowToast = vi.fn()
    mockGateway = {
      createInvoice: vi.fn(),
      updateInvoice: vi.fn(),
      deleteInvoice: vi.fn(),
      getInvoice: vi.fn(),
      getAllInvoices: vi.fn(),
    }

    vi.mocked(useApi).mockReturnValue(mockApi)
    vi.mocked(useToast).mockReturnValue({
      showToast: mockShowToast,
      removeToast: vi.fn(),
      toasts: [],
    })
    vi.mocked(InvoiceGatewayImpl).mockReturnValue(mockGateway)
  })

  describe('useCreateInvoice', () => {
    it('should create invoice successfully', async () => {
      const mockInvoice = InvoiceTestDataFactory.create({ id: 1 })
      const payload = { customer_id: 1, lines: [] }
      mockGateway.createInvoice.mockResolvedValue(mockInvoice)

      const { result } = renderHook(() => useCreateInvoice())

      let invoice: any
      await act(async () => {
        invoice = await result.current.createInvoice(payload)
      })

      expect(result.current.error).toBe(null)
      expect(result.current.loading).toBe(false)
      expect(invoice).toBeInstanceOf(InvoiceEntity)
      expect(mockGateway.createInvoice).toHaveBeenCalledWith(payload)
      expect(mockShowToast).not.toHaveBeenCalled()
    })

    it('should handle network error', async () => {
      const errorMessage = 'Network error'
      const payload = { customer_id: 1, lines: [] }
      const axiosError = new AxiosError()
      axiosError.response = { data: { message: errorMessage } } as any
      mockGateway.createInvoice.mockRejectedValue(axiosError)

      const { result } = renderHook(() => useCreateInvoice())

      await act(async () => {
        await expect(result.current.createInvoice(payload)).rejects.toThrow(
          errorMessage
        )
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(errorMessage)
      expect(mockShowToast).toHaveBeenCalledWith(errorMessage, 'error')
    })

    it('should handle timeout error', async () => {
      const payload = { customer_id: 1, lines: [] }
      const timeoutError = new Error('Timeout')
      mockGateway.createInvoice.mockRejectedValue(timeoutError)

      const { result } = renderHook(() => useCreateInvoice())

      await act(async () => {
        await expect(result.current.createInvoice(payload)).rejects.toThrow()
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(mockShowToast).not.toHaveBeenCalled()
    })
  })

  describe('useUpdateInvoice', () => {
    it('should update invoice successfully', async () => {
      const mockInvoice = InvoiceTestDataFactory.create({ id: 1 })
      const payload = { id: 1, customer_id: 1 }
      mockGateway.updateInvoice.mockResolvedValue(mockInvoice)

      const { result } = renderHook(() => useUpdateInvoice())

      await act(async () => {
        await result.current.updateInvoice(1, payload)
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(mockGateway.updateInvoice).toHaveBeenCalledWith(1, payload)
      expect(mockShowToast).not.toHaveBeenCalled()
    })

    it('should handle error without throwing', async () => {
      const errorMessage = 'Update failed'
      const payload = { id: 1, customer_id: 1 }
      const axiosError = new AxiosError()
      axiosError.response = { data: { message: errorMessage } } as any
      mockGateway.updateInvoice.mockRejectedValue(axiosError)

      const { result } = renderHook(() => useUpdateInvoice())

      await act(async () => {
        await result.current.updateInvoice(1, payload)
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(errorMessage)
      expect(mockShowToast).toHaveBeenCalledWith(errorMessage, 'error')
    })
  })

  describe('useDeleteInvoice', () => {
    it('should delete invoice successfully', async () => {
      mockGateway.deleteInvoice.mockResolvedValue(undefined)

      const { result } = renderHook(() => useDeleteInvoice())

      await act(async () => {
        await result.current.deleteInvoice(1)
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(mockGateway.deleteInvoice).toHaveBeenCalledWith(1)
      expect(mockShowToast).not.toHaveBeenCalled()
    })

    it('should handle error and throw', async () => {
      const errorMessage = 'Delete failed'
      const axiosError = new AxiosError()
      axiosError.response = { data: { message: errorMessage } } as any
      mockGateway.deleteInvoice.mockRejectedValue(axiosError)

      const { result } = renderHook(() => useDeleteInvoice())

      await act(async () => {
        await expect(result.current.deleteInvoice(1)).rejects.toThrow(
          errorMessage
        )
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(errorMessage)
      expect(mockShowToast).toHaveBeenCalledWith(errorMessage, 'error')
    })
  })

  describe('useGetInvoice', () => {
    it('should fetch invoice on mount', async () => {
      const mockInvoice = InvoiceTestDataFactory.create({ id: 1 })
      mockGateway.getInvoice.mockResolvedValue(mockInvoice)

      const { result } = renderHook(() => useGetInvoice(1))

      expect(result.current.loading).toBe(true)
      expect(result.current.data).toBe(null)
      expect(result.current.error).toBe(null)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.data).toBeInstanceOf(InvoiceEntity)
        expect(mockGateway.getInvoice).toHaveBeenCalledWith(1)
      })
    })

    it('should not fetch if no id', () => {
      const { result } = renderHook(() => useGetInvoice(null))

      expect(result.current.loading).toBe(false)
      expect(result.current.data).toBe(null)
      expect(mockGateway.getInvoice).not.toHaveBeenCalled()
    })

    it('should handle error', async () => {
      const errorMessage = 'Fetch failed'
      const axiosError = new AxiosError()
      axiosError.response = { data: { message: errorMessage } } as any
      mockGateway.getInvoice.mockRejectedValue(axiosError)

      const { result } = renderHook(() => useGetInvoice(1))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBe(errorMessage)
        expect(mockShowToast).toHaveBeenCalledWith(errorMessage, 'error')
      })
    })

    it('should refetch', async () => {
      const mockInvoice = InvoiceTestDataFactory.create({ id: 1 })
      mockGateway.getInvoice.mockResolvedValue(mockInvoice)

      const { result } = renderHook(() => useGetInvoice(1))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      mockGateway.getInvoice.mockClear()

      await act(async () => {
        result.current.refetch()
      })

      expect(mockGateway.getInvoice).toHaveBeenCalledWith(1)
    })
  })

  describe('useInvoices', () => {
    it('should fetch invoices on mount', async () => {
      const mockInvoices = [InvoiceTestDataFactory.create({ id: 1 })]
      const mockPagination = {
        page: 1,
        page_size: 25,
        total_pages: 1,
        total_entries: 1,
      }
      mockGateway.getAllInvoices.mockResolvedValue({
        invoices: mockInvoices,
        pagination: mockPagination,
      })

      const { result } = renderHook(() => useInvoices())

      expect(result.current.loading).toBe(true)
      expect(result.current.data).toBe(null)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.data).toHaveLength(1)
        expect(result.current.data![0]).toBeInstanceOf(InvoiceEntity)
        expect(result.current.pagination).toEqual(mockPagination)
      })
    })

    it('should handle error', async () => {
      const errorMessage = 'Fetch failed'
      const axiosError = new AxiosError()
      axiosError.response = { data: { message: errorMessage } } as any
      mockGateway.getAllInvoices.mockRejectedValue(axiosError)

      const { result } = renderHook(() => useInvoices())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBe(errorMessage)
        expect(mockShowToast).toHaveBeenCalledWith(errorMessage, 'error')
      })
    })

    it('should refetch', async () => {
      const mockInvoices = [InvoiceTestDataFactory.create({ id: 1 })]
      const mockPagination = {
        page: 1,
        page_size: 25,
        total_pages: 1,
        total_entries: 1,
      }
      mockGateway.getAllInvoices.mockResolvedValue({
        invoices: mockInvoices,
        pagination: mockPagination,
      })

      const { result } = renderHook(() => useInvoices())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      mockGateway.getAllInvoices.mockClear()
      await act(async () => {
        result.current.refetch()
      })

      expect(mockGateway.getAllInvoices).toHaveBeenCalled()
    })
  })
})
