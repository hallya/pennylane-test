import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { InvoiceFormFields } from '../InvoiceFormFields'

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
    watch: vi.fn((field) => {
      if (field === 'date') return '2023-01-01'
      return ''
    }),
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
      ({ children, ...props }: any) => <input {...props}>{children}</input>,
      {
        Feedback: ({ children, type }: any) => (
          <div data-testid={`feedback-${type}`}>{children}</div>
        ),
      }
    ),
    Check: ({ children, label, ...props }: any) => (
      <div>
        <input type="checkbox" {...props} aria-label={label} />
        {label && <span>{label}</span>}
      </div>
    ),
  },
  Row: ({ children }: any) => <div data-testid="row">{children}</div>,
  Col: ({ children, md }: any) => (
    <div data-testid={`col-${md}`}>{children}</div>
  ),
}))

describe('InvoiceFormFields', () => {
  const mockForm = {
    control: {
      _proxyFormState: { isValid: true, errors: {} },
    },
    watch: vi.fn((field) => {
      if (field === 'date') return '2023-01-01'
      return ''
    }),
    setValue: vi.fn(),
    clearErrors: vi.fn(),
    formState: {
      errors: {},
    },
  } as any

  const defaultProps = {
    form: mockForm,
    validationMode: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(<InvoiceFormFields {...defaultProps} />)

    expect(screen.getByLabelText('Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Échéance')).toBeInTheDocument()
    expect(screen.getByLabelText('Facture payée')).toBeInTheDocument()
  })

  it('renders date field with correct attributes', () => {
    render(<InvoiceFormFields {...defaultProps} />)

    const dateInput = screen.getByLabelText('Date')
    expect(dateInput).toHaveAttribute('type', 'date')
  })

  it('renders deadline field with correct attributes', () => {
    render(<InvoiceFormFields {...defaultProps} />)

    const deadlineInput = screen.getByLabelText('Échéance')
    expect(deadlineInput).toHaveAttribute('type', 'date')
  })

  it('renders paid checkbox', () => {
    render(<InvoiceFormFields {...defaultProps} />)

    const checkbox = screen.getByLabelText('Facture payée')
    expect(checkbox).toHaveAttribute('type', 'checkbox')
  })

  it('shows required indicators when validationMode is finalize', () => {
    render(<InvoiceFormFields {...defaultProps} validationMode="finalize" />)

    expect(screen.getByLabelText('Échéance *')).toBeInTheDocument()
  })

  it('validates deadline is after invoice date', () => {
    const mockFormWithWatch = {
      ...mockForm,
      watch: vi.fn((field) => {
        if (field === 'date') return '2023-01-01'
        return '2022-12-31'
      }),
    }

    render(<InvoiceFormFields {...defaultProps} form={mockFormWithWatch} />)

    expect(screen.getByLabelText('Échéance')).toBeInTheDocument()
  })

  it('shows validation error for date field', () => {
    const mockFormWithErrors = {
      ...mockForm,
      control: {
        _proxyFormState: {
          isValid: false,
          errors: { date: { message: 'Date requise' } },
        },
      },
      formState: {
        errors: { date: { message: 'Date requise' } },
      },
    }

    render(<InvoiceFormFields {...defaultProps} form={mockFormWithErrors} />)

    expect(screen.getByText('Date requise')).toBeInTheDocument()
  })

  it('shows validation error for deadline field', () => {
    const mockFormWithErrors = {
      ...mockForm,
      control: {
        _proxyFormState: {
          isValid: false,
          errors: { deadline: { message: 'Échéance invalide' } },
        },
      },
      formState: {
        errors: { deadline: { message: 'Échéance invalide' } },
      },
    }

    render(<InvoiceFormFields {...defaultProps} form={mockFormWithErrors} />)

    expect(screen.getByText('Échéance invalide')).toBeInTheDocument()
  })

  it('shows validation error for paid field', () => {
    const mockFormWithErrors = {
      ...mockForm,
      control: {
        _proxyFormState: {
          isValid: false,
          errors: { paid: { message: 'Statut requis' } },
        },
      },
      formState: {
        errors: { paid: { message: 'Statut requis' } },
      },
    }

    render(<InvoiceFormFields {...defaultProps} form={mockFormWithErrors} />)

    expect(screen.getByText('Statut requis')).toBeInTheDocument()
  })

  it('handles checkbox change', () => {
    render(<InvoiceFormFields {...defaultProps} />)

    const checkbox = screen.getByLabelText('Facture payée')
    fireEvent.click(checkbox)

    expect(checkbox).toBeInTheDocument()
  })

  it('renders with different validation modes', () => {
    render(<InvoiceFormFields {...defaultProps} validationMode="save" />)

    expect(screen.getByLabelText('Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Échéance')).toBeInTheDocument()
  })
})
