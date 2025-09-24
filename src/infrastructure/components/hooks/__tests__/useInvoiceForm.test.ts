import { renderHook, act } from '@testing-library/react'
import { useInvoiceForm } from '../useInvoiceForm'
import { vi } from 'vitest'

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}))

vi.mock('../../../../adapters/controllers', () => ({
  useCreateInvoice: vi.fn(),
  useUpdateInvoice: vi.fn(),
  useGetInvoice: vi.fn(),
  useSearchCustomers: vi.fn(),
  useSearchProducts: vi.fn(),
}))

vi.mock('../useDebouncedSearch', () => ({
  useDebouncedSearch: vi.fn(),
}))

vi.mock('../useFormManager', () => ({
  useFormManager: vi.fn(),
}))

vi.mock('../../../domain/constants', () => ({
  INVOICE_FORM_CONSTANTS: {
    DEFAULT_QUANTITY: 1,
    MIN_SEARCH_LENGTH: 2,
    SEARCH_DEBOUNCE_MS: 300,
    MIN_PRODUCT_SEARCH_LENGTH: 1,
  },
}))

import { CustomerTestDataFactory } from '../../../../domain/__tests__/utils/customerTestDataFactory'
import { ProductTestDataFactory } from '../../../../domain/__tests__/utils/productTestDataFactory'
import { InvoiceTestDataFactory } from '../../../../domain/__tests__/utils/invoiceTestDataFactory'
import { useNavigate } from 'react-router-dom'

import { useDebouncedSearch } from '../useDebouncedSearch'
import { useFormManager } from '../useFormManager'
import {
  useCreateInvoice,
  useUpdateInvoice,
  useGetInvoice,
  useSearchCustomers,
  useSearchProducts,
} from '../../../../adapters/controllers'

describe('useInvoiceForm', () => {
  const mockNavigate = vi.mocked(useNavigate)
  const mockUseCreateInvoice = vi.mocked(useCreateInvoice)
  const mockUseUpdateInvoice = vi.mocked(useUpdateInvoice)
  const mockUseGetInvoice = vi.mocked(useGetInvoice)
  const mockUseSearchCustomers = vi.mocked(useSearchCustomers)
  const mockUseSearchProducts = vi.mocked(useSearchProducts)
  const mockUseDebouncedSearch = vi.mocked(useDebouncedSearch)
  const mockUseFormManager = vi.mocked(useFormManager)

  beforeEach(() => {
    vi.clearAllMocks()

    mockNavigate.mockReturnValue(vi.fn())
    mockUseCreateInvoice.mockReturnValue({
      createInvoice: vi.fn().mockResolvedValue(undefined),
      loading: false,
      error: null,
    })
    mockUseUpdateInvoice.mockReturnValue({
      updateInvoice: vi.fn().mockResolvedValue(undefined),
      loading: false,
      error: null,
    })
    mockUseGetInvoice.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
    mockUseSearchCustomers.mockReturnValue({
      customers: [],
      loading: false,
      error: null,
      searchCustomers: vi.fn(),
    })
    mockUseSearchProducts.mockReturnValue({
      products: [],
      loading: false,
      error: null,
      searchProducts: vi.fn(),
    })
    mockUseDebouncedSearch.mockReturnValue({
      query: '',
      isSearching: false,
      updateQuery: vi.fn(),
      resetSearch: vi.fn(),
    })
    const formState: any = {
      customerName: '',
      date: '',
      deadline: '',
      paid: false,
      invoiceLines: new Map(),
      quantity: 1,
    }
    mockUseFormManager.mockReturnValue({
      form: {
        setValue: vi.fn().mockImplementation((key, value) => {
          formState[key] = value
        }),
        watch: vi
          .fn()
          .mockImplementation((key) => (key ? formState[key] : formState)),
        clearErrors: vi.fn(),
        getValues: vi.fn().mockImplementation(() => formState),
        handleSubmit: vi
          .fn()
          .mockImplementation((callback) => () => callback(formState)),
      } as any,
      handleSubmit: vi.fn(),
    })
  })

  describe('create mode', () => {
    it('initializes with create mode', () => {
      renderHook(() => useInvoiceForm('create'))

      expect(mockUseGetInvoice).toHaveBeenCalledWith(null)
      expect(mockUseFormManager).toHaveBeenCalledWith({
        onSubmit: expect.any(Function),
        initialValues: {
          customerName: '',
          date: '',
          deadline: '',
          paid: false,
          invoiceLines: new Map(),
          quantity: 1,
        },
        mode: 'onSubmit',
      })
    })

    it('handles customer search change', () => {
      const mockUpdateQuery = vi.fn()
      mockUseDebouncedSearch.mockReturnValue({
        query: '',
        isSearching: false,
        updateQuery: mockUpdateQuery,
        resetSearch: vi.fn(),
      })

      const { result } = renderHook(() => useInvoiceForm('create'))

      act(() => {
        result.current.handleCustomerSearchChange('John Doe')
      })

      expect(mockUpdateQuery).toHaveBeenCalledWith('John Doe')
    })

    it('handles customer selection', () => {
      const mockForm = {
        setValue: vi.fn(),
        watch: vi.fn(),
        clearErrors: vi.fn(),
        getValues: vi.fn(),
        handleSubmit: vi.fn(),
      }
      mockUseFormManager.mockReturnValue({
        form: mockForm as any,
        handleSubmit: vi.fn(),
      })

      const { result } = renderHook(() => useInvoiceForm('create'))

      const customer = CustomerTestDataFactory.create({
        first_name: 'John',
        last_name: 'Doe',
      })

      act(() => {
        result.current.handleCustomerSelect(customer as any)
      })

      expect(result.current.selectedCustomer).toBe(customer)
      expect(mockForm.setValue).toHaveBeenCalledWith('customerName', 'John Doe')
      expect(mockForm.clearErrors).toHaveBeenCalledWith('customerName')
    })

    it('handles product addition to invoice', () => {
      const mockForm = {
        setValue: vi.fn(),
        watch: vi.fn().mockReturnValue(new Map()),
        clearErrors: vi.fn(),
        getValues: vi.fn(),
        handleSubmit: vi.fn(),
      }
      mockUseFormManager.mockReturnValue({
        form: mockForm as any,
        handleSubmit: vi.fn(),
      })

      const { result } = renderHook(() => useInvoiceForm('create'))

      const product = ProductTestDataFactory.create({
        id: 1,
        label: 'Test Product',
        unit: 'piece',
        vat_rate: '20',
        unit_price: '100',
        unit_tax: '20',
      })

      act(() => {
        result.current.handleAddProductToInvoice(product as any, 2)
      })

      expect(mockForm.setValue).toHaveBeenCalled()
      const call = mockForm.setValue.mock.calls[0]
      expect(call[0]).toBe('invoiceLines')
      const linesMap = call[1] as Map<number, any>
      expect(linesMap.get(1)).toEqual({
        product_id: 1,
        quantity: 2,
        label: 'Test Product',
        unit: 'piece',
        vat_rate: '20',
        price: '100',
        tax: '20',
      })
    })

    it('handles line removal', () => {
      const existingLines = new Map([[1, { product_id: 1, quantity: 1 }]])
      const mockForm = {
        setValue: vi.fn(),
        watch: vi.fn().mockReturnValue(existingLines),
        clearErrors: vi.fn(),
        getValues: vi.fn(),
        handleSubmit: vi.fn(),
      }
      mockUseFormManager.mockReturnValue({
        form: mockForm as any,
        handleSubmit: vi.fn(),
      })

      const { result } = renderHook(() => useInvoiceForm('create'))

      act(() => {
        result.current.handleRemoveLine(1)
      })

      expect(mockForm.setValue).toHaveBeenCalledWith('invoiceLines', new Map())
    })

    it('submits create invoice successfully', async () => {
      const mockCreateInvoice = vi.fn().mockResolvedValue(undefined)
      const navigateMock = vi.fn()
      mockUseCreateInvoice.mockReturnValue({
        createInvoice: mockCreateInvoice,
        loading: false,
        error: null,
      })
      mockNavigate.mockReturnValue(navigateMock)

      const formState: any = {
        customerName: '',
        date: '',
        deadline: '',
        paid: false,
        invoiceLines: new Map(),
        quantity: 1,
      }

      const mockForm = {
        setValue: vi.fn().mockImplementation((key, value) => {
          formState[key] = value
        }),
        watch: vi.fn().mockReturnValue(
          new Map([
            [
              1,
              {
                product_id: 1,
                quantity: 2,
                label: 'Product',
                unit: 'piece',
                vat_rate: '20',
                price: 100,
                tax: 20,
              },
            ],
          ])
        ),
        clearErrors: vi.fn(),
        getValues: vi.fn(),
        handleSubmit: vi
          .fn()
          .mockImplementation((callback) => () => callback(formState)),
      }
      mockUseFormManager.mockReturnValue({
        form: mockForm as any,
        handleSubmit: vi.fn(),
      })

      const { result } = renderHook(() => useInvoiceForm('create'))

      act(() => {
        result.current.setSelectedCustomer(
          CustomerTestDataFactory.create({
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
          }) as any
        )
      })

      act(() => {
        result.current.form.setValue('customerName', 'John Doe')
        result.current.form.setValue('date', '2024-01-01')
        result.current.form.setValue('deadline', '2024-01-31')
        result.current.form.setValue('paid', false)
        result.current.form.setValue(
          'invoiceLines',
          new Map([
            [
              1,
              {
                product_id: 1,
                quantity: 2,
                label: 'Product',
                unit: 'piece',
                vat_rate: '20',
                price: 100,
                tax: 20,
              },
            ],
          ])
        )
      })

      await act(async () => {
        await result.current.handleSave()
      })

      expect(mockCreateInvoice).toHaveBeenCalledWith({
        customer_id: 1,
        finalized: false,
        paid: false,
        date: '2024-01-01',
        deadline: '2024-01-31',
        invoice_lines_attributes: [
          {
            product_id: 1,
            quantity: 2,
            label: 'Product',
            unit: 'piece',
            vat_rate: '20',
            price: 100,
            tax: 20,
          },
        ],
      })
      expect(navigateMock).toHaveBeenCalledWith('/invoices')
    })
  })

  describe('edit mode', () => {
    it('loads invoice data on edit', () => {
      const invoiceData = InvoiceTestDataFactory.create({
        customer: CustomerTestDataFactory.create({
          first_name: 'John',
          last_name: 'Doe',
        }),
        date: '2024-01-01',
        deadline: '2024-01-31',
        paid: true,
      })

      mockUseGetInvoice.mockReturnValue({
        data: invoiceData as any,
        loading: false,
        error: null,
        refetch: vi.fn(),
      })

      const mockForm = {
        setValue: vi.fn(),
        watch: vi.fn(),
        clearErrors: vi.fn(),
        getValues: vi.fn(),
        handleSubmit: vi.fn(),
      }
      mockUseFormManager.mockReturnValue({
        form: mockForm as any,
        handleSubmit: vi.fn(),
      })

      renderHook(() => useInvoiceForm('edit', 1))

      expect(mockUseGetInvoice).toHaveBeenCalledWith(1)
      expect(mockForm.setValue).toHaveBeenCalledWith('customerName', 'John Doe')
      expect(mockForm.setValue).toHaveBeenCalledWith('date', '2024-01-01')
      expect(mockForm.setValue).toHaveBeenCalledWith('deadline', '2024-01-31')
      expect(mockForm.setValue).toHaveBeenCalledWith('paid', true)
    })

    it('submits update invoice successfully', async () => {
      const mockUpdateInvoice = vi.fn().mockResolvedValue(undefined)
      const navigateMock = vi.fn()
      mockUseUpdateInvoice.mockReturnValue({
        updateInvoice: mockUpdateInvoice,
        loading: false,
        error: null,
      })
      mockNavigate.mockReturnValue(navigateMock)

      const formState: any = {
        customerName: '',
        date: '',
        deadline: '',
        paid: false,
        invoiceLines: new Map(),
        quantity: 1,
      }

      const mockForm = {
        setValue: vi.fn().mockImplementation((key, value) => {
          formState[key] = value
        }),
        watch: vi.fn().mockReturnValue(
          new Map([
            [
              1,
              {
                id: 1,
                product_id: 1,
                quantity: 2,
                label: 'Product',
                unit: 'piece',
                vat_rate: '20',
                price: 100,
                tax: 20,
              },
            ],
          ])
        ),
        clearErrors: vi.fn(),
        getValues: vi.fn(),
        handleSubmit: vi
          .fn()
          .mockImplementation((callback) => () => callback(formState)),
      }
      mockUseFormManager.mockReturnValue({
        form: mockForm as any,
        handleSubmit: vi.fn(),
      })

      const { result } = renderHook(() => useInvoiceForm('edit', 1))

      act(() => {
        result.current.setSelectedCustomer(
          CustomerTestDataFactory.create({
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
          }) as any
        )
      })

      act(() => {
        result.current.form.setValue('customerName', 'John Doe')
        result.current.form.setValue('date', '2024-01-01')
        result.current.form.setValue('deadline', '2024-01-31')
        result.current.form.setValue('paid', true)
        result.current.form.setValue(
          'invoiceLines',
          new Map([
            [
              1,
              {
                id: 1,
                product_id: 1,
                quantity: 2,
                label: 'Product',
                unit: 'piece',
                vat_rate: '20',
                price: '100',
                tax: '20',
              },
            ],
          ])
        )
      })

      await act(async () => {
        await result.current.handleFinalize()
      })

      expect(mockUpdateInvoice).toHaveBeenCalledWith(1, {
        id: 1,
        customer_id: 1,
        finalized: true,
        paid: true,
        date: '2024-01-01',
        deadline: '2024-01-31',
        invoice_lines_attributes: [
          {
            id: 1,
            product_id: 1,
            quantity: 2,
            label: 'Product',
            unit: 'piece',
            vat_rate: '20',
            price: '100',
            tax: '20',
          },
        ],
      })
      expect(navigateMock).toHaveBeenCalledWith('/invoices')
    })
  })
})
