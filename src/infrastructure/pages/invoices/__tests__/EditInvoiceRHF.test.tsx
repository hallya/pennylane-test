import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import EditInvoiceRHF from '../EditInvoiceRHF'
import { useInvoiceForm } from '../../../components/hooks'
import { CustomerTestDataFactory } from '../../../../domain/__tests__/utils/customerTestDataFactory'
import { ProductTestDataFactory } from '../../../../domain/__tests__/utils/productTestDataFactory'

const mockHistoryBack = vi.fn()
const mockUseParams = vi.fn(() => ({ id: '123' }))

Object.defineProperty(window, 'history', {
  value: {
    back: mockHistoryBack,
  },
  writable: true,
})

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: mockUseParams,
    useNavigate: vi.fn(),
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
  }
})

vi.mock('../../../components/hooks', () => ({
  useInvoiceForm: vi.fn(),
  useFormManager: vi.fn(() => ({
    form: {
      watch: vi.fn(() => []),
      control: {},
      handleSubmit: vi.fn((callback) => () => callback({})),
      setValue: vi.fn(),
      clearErrors: vi.fn(),
      getValues: vi.fn(),
      getFieldState: vi.fn(),
      setError: vi.fn(),
      trigger: vi.fn(),
      reset: vi.fn(),
      resetField: vi.fn(),
      unregister: vi.fn(),
      formState: {
        errors: {},
        isValid: true,
        isDirty: false,
        isSubmitted: false,
      },
    },
  })),
  useDebouncedSearch: vi.fn(() => ({
    query: '',
    updateQuery: vi.fn(),
  })),
}))

vi.mock('../../../../api', () => ({
  useApi: vi.fn(() => ({})),
}))

vi.mock('../../../components/hooks/useToast', () => ({
  useToast: vi.fn(() => ({
    showToast: vi.fn(),
  })),
}))

vi.mock('../../../components/invoices', () => ({
  CustomerSelector: ({
    form,
    customers,
    selectedCustomer,
    showSuggestions,
    handleCustomerSearchChange,
    handleCustomerSelect,
    validationMode,
  }: any) => (
    <div
      data-testid="customer-selector"
      data-props={JSON.stringify({
        customers: customers.length,
        selectedCustomer: selectedCustomer ? selectedCustomer.id : null,
        showSuggestions,
        validationMode,
      })}
    >
      CustomerSelector
    </div>
  ),
  InvoiceFormFields: ({ form, validationMode }: any) => (
    <div
      data-testid="invoice-form-fields"
      data-validation-mode={validationMode}
    >
      InvoiceFormFields
    </div>
  ),
  ProductLinesSelector: ({
    form,
    products,
    productSearchQuery,
    updateProductQuery,
    searchProducts,
    selectedProduct,
    setSelectedProduct,
    showProducts,
    setShowProducts,
    invoiceLines,
    handleAddProductToInvoice,
    handleRemoveLine,
    validationMode,
  }: any) => (
    <div
      data-testid="product-lines-selector"
      data-props={JSON.stringify({
        products: products.length,
        productSearchQuery,
        selectedProduct: selectedProduct?.id,
        showProducts,
        invoiceLinesSize: invoiceLines.size,
        validationMode,
      })}
    >
      ProductLinesSelector
    </div>
  ),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn(() => ({ id: '123' })),
    useNavigate: vi.fn(),
  }
})

describe('EditInvoiceRHF', () => {
  const mockForm = {
    control: {},
    handleSubmit: vi.fn(),
    watch: vi.fn(),
    setValue: vi.fn(),
    clearErrors: vi.fn(),
    getValues: vi.fn(),
    getFieldState: vi.fn(),
    setError: vi.fn(),
    trigger: vi.fn(),
    reset: vi.fn(),
    resetField: vi.fn(),
    unregister: vi.fn(),
    formState: {
      errors: {},
      isValid: true,
      isDirty: false,
      isSubmitted: false,
    },
  } as any

  const mockCustomers = [CustomerTestDataFactory.create()]
  const mockProducts = [ProductTestDataFactory.create()]
  const mockSelectedCustomer = CustomerTestDataFactory.create()
  const mockSelectedProduct = ProductTestDataFactory.create()
  const mockInvoiceLines = new Map([
    [1, { product_id: 1, quantity: 2, label: 'Test Product' }],
  ])

  const defaultMockHookReturn = {
    form: mockForm,
    validationMode: null,
    customers: mockCustomers,
    selectedCustomer: null,
    setSelectedCustomer: vi.fn(),
    showSuggestions: false,
    setShowSuggestions: vi.fn(),
    handleCustomerSearchChange: vi.fn(),
    handleCustomerSelect: vi.fn(),
    products: mockProducts,
    productSearchQuery: '',
    updateProductQuery: vi.fn(),
    searchProducts: vi.fn(),
    selectedProduct: null,
    setSelectedProduct: vi.fn(),
    showProducts: false,
    setShowProducts: vi.fn(),
    invoiceLines: mockInvoiceLines,
    handleAddProductToInvoice: vi.fn(),
    handleRemoveLine: vi.fn(),
    handleSave: vi.fn(),
    handleFinalize: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useInvoiceForm).mockReturnValue(defaultMockHookReturn)
  })

  const renderComponent = (invoiceId: string = '123') => {
    // Mock react-router-dom with the specific invoice ID
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual,
        useParams: vi.fn(() => ({ id: invoiceId })),
        useNavigate: vi.fn(),
      }
    })

    return render(
      <MemoryRouter>
        <EditInvoiceRHF />
      </MemoryRouter>
    )
  }

  it('renders the invoice edit page with correct title', () => {
    renderComponent()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Modifier la Facture #123',
      })
    ).toBeInTheDocument()
  })

  it('renders the form element', () => {
    renderComponent()

    expect(screen.getByText('CustomerSelector')).toBeInTheDocument()
    expect(screen.getByText('InvoiceFormFields')).toBeInTheDocument()
    expect(screen.getByText('ProductLinesSelector')).toBeInTheDocument()
  })

  it('renders all child components', () => {
    renderComponent()

    expect(screen.getByTestId('customer-selector')).toBeInTheDocument()
    expect(screen.getByTestId('invoice-form-fields')).toBeInTheDocument()
    expect(screen.getByTestId('product-lines-selector')).toBeInTheDocument()
  })

  it('renders action buttons with correct labels', () => {
    renderComponent()

    expect(screen.getByRole('button', { name: 'Annuler' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Enregistrer' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Finaliser' })
    ).toBeInTheDocument()
  })

  it('navigates back when cancel button is clicked', async () => {
    renderComponent()

    const cancelButton = screen.getByRole('button', { name: 'Annuler' })
    await fireEvent.click(cancelButton)

    expect(window.history.back).toHaveBeenCalled()
  })

  it('renders with different hook values', () => {
    const customHookReturn = {
      ...defaultMockHookReturn,
      selectedCustomer: mockSelectedCustomer,
      showSuggestions: true,
      validationMode: 'finalize' as const,
      selectedProduct: mockSelectedProduct,
      showProducts: true,
      productSearchQuery: 'test query',
    }
    vi.mocked(useInvoiceForm).mockReturnValue(customHookReturn)

    renderComponent()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Modifier la Facture #123',
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeInTheDocument()
  })

  it('renders with different invoice IDs', () => {
    expect(() => renderComponent('456')).not.toThrow()
    expect(() => renderComponent('invalid')).not.toThrow()
  })
})