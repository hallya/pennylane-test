import { render, screen, fireEvent } from '@testing-library/react'
import { CustomerSelector } from '../CustomerSelector'
import { CustomerTestDataFactory } from '../../../../domain/__tests__/utils/customerTestDataFactory'
import { FormWrapper } from '../../../shared/FormWrapper'
import { InvoiceFormData } from '../../../pages/invoices/types'

describe('CustomerSelector', () => {
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
    customers: mockCustomers,
    selectedCustomer: null,
    showSuggestions: false,
    handleCustomerSearchChange: vi.fn(),
    handleCustomerSelect: vi.fn(),
    validationMode: null,
  }

  it('renders the customer selector with correct label', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <CustomerSelector form={form} {...defaultProps} />}
      </FormWrapper>
    )

    expect(screen.getByLabelText('Client')).toBeInTheDocument()
  })

  it('renders required label when validationMode is finalize', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => (
          <CustomerSelector
            form={form}
            {...defaultProps}
            validationMode="finalize"
          />
        )}
      </FormWrapper>
    )

    expect(screen.getByLabelText('Client *')).toBeInTheDocument()
  })

  it('renders input field with correct attributes', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <CustomerSelector form={form} {...defaultProps} />}
      </FormWrapper>
    )

    const input = screen.getByLabelText('Client')
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveAttribute('placeholder', 'Tapez le nom du client...')
    expect(input).toHaveAttribute('autoComplete', 'off')
  })

  it('calls handleCustomerSearchChange when input value changes', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <CustomerSelector form={form} {...defaultProps} />}
      </FormWrapper>
    )

    const input = screen.getByLabelText('Client')
    fireEvent.change(input, { target: { value: 'John' } })

    expect(defaultProps.handleCustomerSearchChange).toHaveBeenCalledWith('John')
  })

  it('shows suggestions dropdown when showSuggestions is true', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => (
          <CustomerSelector
            form={form}
            {...defaultProps}
            showSuggestions={true}
          />
        )}
      </FormWrapper>
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('does not show suggestions dropdown when showSuggestions is false', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => (
          <CustomerSelector
            form={form}
            {...defaultProps}
            showSuggestions={false}
          />
        )}
      </FormWrapper>
    )

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  it('renders customer suggestions with correct information', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => (
          <CustomerSelector
            form={form}
            {...defaultProps}
            showSuggestions={true}
          />
        )}
      </FormWrapper>
    )

    const items = screen.getAllByRole('button')
    expect(items).toHaveLength(2)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('calls handleCustomerSelect when clicking on a customer suggestion', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => (
          <CustomerSelector
            form={form}
            {...defaultProps}
            showSuggestions={true}
          />
        )}
      </FormWrapper>
    )

    const johnDoeItem = screen.getByText('John Doe')
    fireEvent.click(johnDoeItem)

    expect(defaultProps.handleCustomerSelect).toHaveBeenCalledWith(mockCustomers[0])
  })

  it('shows valid state when customer is selected', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => (
          <CustomerSelector
            form={form}
            {...defaultProps}
            selectedCustomer={mockCustomers[0]}
          />
        )}
      </FormWrapper>
    )

    const input = screen.getByLabelText('Client')
    expect(input).toHaveClass('is-valid')
  })

  it('does not show suggestions when customers list is empty', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => (
          <CustomerSelector
            form={form}
            {...defaultProps}
            customers={[]}
            showSuggestions={true}
          />
        )}
      </FormWrapper>
    )

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })
})
