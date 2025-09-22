import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { CustomerSelector } from '../CustomerSelector'
import { CustomerTestDataFactory } from '../../../../domain/__tests__/utils/customerTestDataFactory'

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

vi.mock('react-bootstrap', () => ({
  Form: {
    Group: ({ children }: any) => (
      <div data-testid="form-group">{children}</div>
    ),
    Label: ({ children, htmlFor }: any) => (
      <label htmlFor={htmlFor}>{children}</label>
    ),
    Control: Object.assign(
      ({ children, isValid, isInvalid, ...props }: any) => {
        const className = [
          props.className,
          isValid ? 'is-valid' : '',
          isInvalid ? 'is-invalid' : '',
        ].filter(Boolean).join(' ')
        return <input {...props} className={className}>{children}</input>
      },
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
  Row: ({ children }: any) => <div data-testid="row">{children}</div>,
  Col: ({ children, md }: any) => (
    <div data-testid={`col-${md}`}>{children}</div>
  ),
}))

describe('CustomerSelector', () => {
  const mockForm = {
    control: {
      _proxyFormState: { isValid: true, errors: {} },
    },
    watch: vi.fn(),
    setValue: vi.fn(),
    clearErrors: vi.fn(),
    formState: {
      errors: {},
    },
  } as any

  const mockCustomers = [
    CustomerTestDataFactory.create({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
    }),
    CustomerTestDataFactory.create({
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
    }),
  ]

  const defaultProps = {
    form: mockForm,
    customers: mockCustomers,
    selectedCustomer: null,
    showSuggestions: false,
    handleCustomerSearchChange: vi.fn(),
    handleCustomerSelect: vi.fn(),
    validationMode: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the customer selector with correct label', () => {
    render(<CustomerSelector {...defaultProps} />)

    expect(screen.getByLabelText('Client')).toBeInTheDocument()
  })

  it('renders required label when validationMode is finalize', () => {
    render(<CustomerSelector {...defaultProps} validationMode="finalize" />)

    expect(screen.getByLabelText('Client *')).toBeInTheDocument()
  })

  it('renders input field with correct attributes', () => {
    render(<CustomerSelector {...defaultProps} />)

    const input = screen.getByLabelText('Client')
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveAttribute('placeholder', 'Tapez le nom du client...')
    expect(input).toHaveAttribute('autoComplete', 'off')
  })

  it('calls handleCustomerSearchChange when input value changes', () => {
    const mockHandleChange = vi.fn()
    render(
      <CustomerSelector
        {...defaultProps}
        handleCustomerSearchChange={mockHandleChange}
      />
    )

    const input = screen.getByLabelText('Client')
    fireEvent.change(input, { target: { value: 'John' } })

    expect(mockHandleChange).toHaveBeenCalledWith('John')
  })

  it('clears errors when input changes and errors exist', () => {
    const mockFormWithErrors = {
      ...mockForm,
      formState: {
        errors: { customerName: { message: 'Required' } },
      },
      clearErrors: vi.fn(),
    }

    render(<CustomerSelector {...defaultProps} form={mockFormWithErrors} />)

    const input = screen.getByLabelText('Client')
    fireEvent.change(input, { target: { value: 'John' } })

    expect(mockFormWithErrors.clearErrors).toHaveBeenCalledWith('customerName')
  })

  it('shows suggestions dropdown when showSuggestions is true', () => {
    render(<CustomerSelector {...defaultProps} showSuggestions={true} />)

    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument()
  })

  it('does not show suggestions dropdown when showSuggestions is false', () => {
    render(<CustomerSelector {...defaultProps} showSuggestions={false} />)

    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument()
  })

  it('renders customer suggestions with correct information', () => {
    render(<CustomerSelector {...defaultProps} showSuggestions={true} />)

    const items = screen.getAllByTestId('dropdown-item')
    expect(items).toHaveLength(2)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('calls handleCustomerSelect when clicking a suggestion', () => {
    const mockHandleSelect = vi.fn()
    render(
      <CustomerSelector
        {...defaultProps}
        showSuggestions={true}
        handleCustomerSelect={mockHandleSelect}
      />
    )

    const firstItem = screen.getAllByTestId('dropdown-item')[0]
    fireEvent.click(firstItem)

    expect(mockHandleSelect).toHaveBeenCalledWith(mockCustomers[0])
  })

  it('renders with selected customer', () => {
    const selectedCustomer = mockCustomers[0]

    render(
      <CustomerSelector {...defaultProps} selectedCustomer={selectedCustomer} />
    )

    // Just verify it renders without errors with a selected customer
    expect(screen.getByLabelText('Client')).toBeInTheDocument()
  })

  it('shows validation error when field has error', () => {
    const mockFormWithErrors = {
      ...mockForm,
      control: {
        _proxyFormState: { isValid: false, errors: { customerName: { message: 'Client requis' } } },
      },
      formState: {
        errors: { customerName: { message: 'Client requis' } },
      },
    }

    render(<CustomerSelector {...defaultProps} form={mockFormWithErrors} />)

    expect(screen.getByTestId('feedback-invalid')).toHaveTextContent('Client requis')
  })

  it('shows valid state when customer is selected and no errors', () => {
    const selectedCustomer = mockCustomers[0]
    const mockFormValid = {
      ...mockForm,
      formState: {
        errors: {},
      },
    }

    render(
      <CustomerSelector
        {...defaultProps}
        form={mockFormValid}
        selectedCustomer={selectedCustomer}
      />
    )

    const input = screen.getByLabelText('Client')
    expect(input).toHaveClass('is-valid')
  })
})
