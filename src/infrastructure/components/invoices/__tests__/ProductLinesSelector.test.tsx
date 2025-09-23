import { render, screen, fireEvent } from '@testing-library/react'
import { ProductLinesSelector } from '../ProductLinesSelector'
import { ProductTestDataFactory } from '../../../../domain/__tests__/utils/productTestDataFactory'

vi.mock('react-hook-form', () => ({
  Controller: ({ render, name, control }: any) => {
    const formState = control?._proxyFormState || { errors: {} }
    const error = formState.errors?.[name]
    return render({
      field: {
        onChange: vi.fn(),
        onBlur: vi.fn(),
        value: '',
        name,
      },
      fieldState: { error },
      formState,
    })
  },
  useFormContext: vi.fn(() => ({
    control: {},
    watch: vi.fn(),
    setValue: vi.fn(),
    clearErrors: vi.fn(),
    formState: { errors: {} },
  })),
}))

vi.mock('../../../shared/chartUtils', () => ({
  formatCurrency: (value: number) => `€${value.toFixed(2)}`,
}))

vi.mock('react-bootstrap', () => ({
  Form: {
    Group: ({ children }: any) => (
      <div data-testid="form-group">{children}</div>
    ),
    Label: ({ children, htmlFor }: any) => (
      <label htmlFor={htmlFor}>{children}</label>
    ),
    Control: Object.assign(
      ({ children, ...props }: any) => <input {...props}>{children}</input>,
      {
        Feedback: ({ children, type }: any) => (
          <div data-testid={`feedback-${type}`}>{children}</div>
        ),
      }
    ),
  },
  Dropdown: {
    Menu: ({ children, show }: any) =>
      show ? <div data-testid="dropdown-menu">{children}</div> : null,
    Item: ({ children, onClick }: any) => (
      <div data-testid="dropdown-item" onClick={onClick}>
        {children}
      </div>
    ),
  },
  Card: Object.assign(
    ({ children, className }: any) => (
      <div data-testid="card" className={className}>
        {children}
      </div>
    ),
    {
      Header: ({ children }: any) => (
        <div data-testid="card-header">{children}</div>
      ),
      Body: ({ children }: any) => (
        <div data-testid="card-body">{children}</div>
      ),
    }
  ),
  Row: ({ children }: any) => <div data-testid="row">{children}</div>,
  Col: ({ children, md }: any) => (
    <div data-testid={`col-${md}`}>{children}</div>
  ),
  Button: ({ children, onClick, disabled, variant }: any) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant}>
      {children}
    </button>
  ),
}))

describe('ProductLinesSelector', () => {
  const mockForm = {
    control: {
      _proxyFormState: { isValid: true, errors: {} },
    },
    watch: vi.fn(() => new Map()),
    setValue: vi.fn(),
    clearErrors: vi.fn(),
    formState: {
      errors: {},
    },
  } as any

  const mockProducts = [
    ProductTestDataFactory.create({
      id: 1,
      label: 'Product A',
      unit_price: '10.00',
      vat_rate: '20',
    }),
    ProductTestDataFactory.create({
      id: 2,
      label: 'Product B',
      unit_price: '15.00',
      vat_rate: '10',
    }),
  ]

  const mockInvoiceLines = new Map([
    [
      1,
      {
        product_id: 1,
        quantity: 2,
        label: 'Product A',
        unit: 'piece' as const,
        vat_rate: '20' as const,
        price: '20.00',
        tax: '4.00',
      },
    ],
  ])

  const defaultProps = {
    form: mockForm,
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
    validationMode: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the component structure', () => {
    render(<ProductLinesSelector {...defaultProps} />)

    expect(screen.getByTestId('card-header')).toBeInTheDocument()
    expect(screen.getByTestId('card-body')).toBeInTheDocument()
    expect(screen.getByText('Lignes de Produits')).toBeInTheDocument()
  })

  it('renders product search input', () => {
    render(<ProductLinesSelector {...defaultProps} />)

    const input = screen.getByPlaceholderText('Rechercher un produit...')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('renders quantity input', () => {
    render(<ProductLinesSelector {...defaultProps} />)

    const quantityInput = screen.getByPlaceholderText('Quantité')
    expect(quantityInput).toBeInTheDocument()
    expect(quantityInput).toHaveAttribute('type', 'number')
    expect(quantityInput).toHaveAttribute('min', '1')
  })

  it('renders add button', () => {
    render(<ProductLinesSelector {...defaultProps} />)

    const addButton = screen.getByRole('button', { name: 'Ajouter' })
    expect(addButton).toBeInTheDocument()
    expect(addButton).toBeDisabled()
  })

  it('shows products dropdown when showProducts is true', () => {
    render(<ProductLinesSelector {...defaultProps} showProducts={true} />)

    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument()
  })

  it('renders product suggestions', () => {
    render(<ProductLinesSelector {...defaultProps} showProducts={true} />)

    const items = screen.getAllByTestId('dropdown-item')
    expect(items).toHaveLength(2)
    expect(screen.getAllByText('Product A')).toHaveLength(2)
    expect(screen.getByText('Product B')).toBeInTheDocument()
  })

  it('calls setSelectedProduct when clicking a product suggestion', () => {
    const mockSetSelected = vi.fn()
    render(
      <ProductLinesSelector
        {...defaultProps}
        showProducts={true}
        setSelectedProduct={mockSetSelected}
      />
    )

    const firstItem = screen.getAllByTestId('dropdown-item')[0]
    fireEvent.click(firstItem)

    expect(mockSetSelected).toHaveBeenCalledWith(mockProducts[0])
  })

  it('enables add button when product is selected', () => {
    render(
      <ProductLinesSelector
        {...defaultProps}
        selectedProduct={mockProducts[0]}
      />
    )

    const addButton = screen.getByRole('button', { name: 'Ajouter' })
    expect(addButton).not.toBeDisabled()
  })

  it('calls handleAddProductToInvoice when add button is clicked', () => {
    const mockAddProduct = vi.fn()
    render(
      <ProductLinesSelector
        {...defaultProps}
        selectedProduct={mockProducts[0]}
        handleAddProductToInvoice={mockAddProduct}
      />
    )

    const addButton = screen.getByRole('button', { name: 'Ajouter' })
    fireEvent.click(addButton)

    expect(mockAddProduct).toHaveBeenCalledWith(mockProducts[0], 1)
  })

  it('renders invoice lines when present', () => {
    render(<ProductLinesSelector {...defaultProps} />)

    expect(screen.getByText('Product A')).toBeInTheDocument()
    expect(
      screen.getByText((content, element) => content.includes('Quantité: 2'))
    ).toBeInTheDocument()
    expect(
      screen.getByText((content, element) => content.includes('Prix TTC:'))
    ).toBeInTheDocument()
  })

  it('renders remove button for each line', () => {
    render(<ProductLinesSelector {...defaultProps} />)

    const removeButton = screen.getByRole('button', { name: 'Supprimer' })
    expect(removeButton).toBeInTheDocument()
  })

  it('calls handleRemoveLine when remove button is clicked', () => {
    const mockRemoveLine = vi.fn()
    render(
      <ProductLinesSelector
        {...defaultProps}
        handleRemoveLine={mockRemoveLine}
      />
    )

    const removeButton = screen.getByRole('button', { name: 'Supprimer' })
    fireEvent.click(removeButton)

    expect(mockRemoveLine).toHaveBeenCalledWith(1)
  })

  it('displays totals correctly', () => {
    render(<ProductLinesSelector {...defaultProps} />)

    expect(screen.getByText('Quantité totale:')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Taxe totale:')).toBeInTheDocument()
    expect(screen.getByText('€4.00')).toBeInTheDocument()
    expect(screen.getByText('Total TTC:')).toBeInTheDocument()
    expect(screen.getByText('€40.00')).toBeInTheDocument()
  })

  it('shows validation error when no products and finalize mode', () => {
    const mockFormWithErrors = {
      ...mockForm,
      control: {
        _proxyFormState: {
          isValid: false,
          errors: { invoiceLines: { message: 'Au moins un produit requis' } },
        },
      },
      formState: {
        errors: { invoiceLines: { message: 'Au moins un produit requis' } },
      },
    }

    render(
      <ProductLinesSelector
        {...defaultProps}
        form={mockFormWithErrors}
        validationMode="finalize"
      />
    )

    expect(screen.getByText('Au moins un produit requis')).toBeInTheDocument()
  })

  it('calls searchProducts on input change', () => {
    const mockSearchProducts = vi.fn()
    render(
      <ProductLinesSelector
        {...defaultProps}
        searchProducts={mockSearchProducts}
      />
    )

    const input = screen.getByPlaceholderText('Rechercher un produit...')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(mockSearchProducts).toHaveBeenCalledWith('test')
  })

  it('handles quantity input change', () => {
    render(<ProductLinesSelector {...defaultProps} />)

    const quantityInput = screen.getByPlaceholderText('Quantité')
    fireEvent.change(quantityInput, { target: { value: '5' } })

    expect(quantityInput).toHaveValue(5)
  })
})
