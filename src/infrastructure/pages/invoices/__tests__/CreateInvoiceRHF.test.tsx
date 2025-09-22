import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import CreateInvoiceRHF from '../CreateInvoiceRHF'
import { useCreateInvoiceForm } from '../../../components/hooks'
import { CustomerTestDataFactory } from '../../../../domain/__tests__/utils/customerTestDataFactory'
import { ProductTestDataFactory } from '../../../../domain/__tests__/utils/productTestDataFactory'
import { Components } from '../../../../api/gen/client'

vi.mock('../../../components/hooks', () => ({
  useCreateInvoiceForm: vi.fn(),
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

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('CreateInvoiceRHF', () => {
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
    mockNavigate.mockClear()
    vi.mocked(useCreateInvoiceForm).mockReturnValue(defaultMockHookReturn)
  })

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CreateInvoiceRHF />
      </BrowserRouter>
    )
  }

  it('renders the invoice creation page with correct title', () => {
    renderComponent()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Créer une Nouvelle Facture',
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

  it('calls handleSave when save button is clicked', () => {
    const mockHandleSave = vi.fn()
    vi.mocked(useCreateInvoiceForm).mockReturnValue({
      ...defaultMockHookReturn,
      handleSave: mockHandleSave,
    })

    renderComponent()

    const saveButton = screen.getByRole('button', { name: 'Enregistrer' })
    fireEvent.click(saveButton)

    expect(mockHandleSave).toHaveBeenCalledTimes(1)
  })

  it('calls handleFinalize when finalize button is clicked', () => {
    const mockHandleFinalize = vi.fn()
    vi.mocked(useCreateInvoiceForm).mockReturnValue({
      ...defaultMockHookReturn,
      handleFinalize: mockHandleFinalize,
    })

    renderComponent()

    const finalizeButton = screen.getByRole('button', { name: 'Finaliser' })
    fireEvent.click(finalizeButton)

    expect(mockHandleFinalize).toHaveBeenCalledTimes(1)
  })

  it('navigates to invoices list when cancel button is clicked', () => {
    renderComponent()

    const cancelButton = screen.getByRole('button', { name: 'Annuler' })
    fireEvent.click(cancelButton)

    expect(mockNavigate).toHaveBeenCalledWith('/invoices')
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
    vi.mocked(useCreateInvoiceForm).mockReturnValue(customHookReturn)

    renderComponent()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Créer une Nouvelle Facture',
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeInTheDocument()
  })
})
