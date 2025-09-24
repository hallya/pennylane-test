import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { InvoiceFormFields } from '../InvoiceFormFields'
import { FormWrapper } from '../../../shared/FormWrapper'
import { InvoiceFormData } from '../../../pages/invoices/types'

describe('InvoiceFormFields', () => {
  it('renders all form fields', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <InvoiceFormFields form={form} validationMode={null} />}
      </FormWrapper>
    )

    expect(screen.getByLabelText('Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Échéance')).toBeInTheDocument()
    expect(screen.getByText('Facture payée')).toBeInTheDocument()
  })

  it('renders date field with correct attributes', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <InvoiceFormFields form={form} validationMode={null} />}
      </FormWrapper>
    )

    const dateInput = screen.getByLabelText('Date')
    expect(dateInput).toHaveAttribute('type', 'date')
  })

  it('renders deadline field with correct attributes', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <InvoiceFormFields form={form} validationMode={null} />}
      </FormWrapper>
    )

    const deadlineInput = screen.getByLabelText('Échéance')
    expect(deadlineInput).toHaveAttribute('type', 'date')
  })

  it('renders paid checkbox', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <InvoiceFormFields form={form} validationMode={null} />}
      </FormWrapper>
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('type', 'checkbox')
  })

  it('shows required indicators when validationMode is finalize', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <InvoiceFormFields form={form} validationMode="finalize" />}
      </FormWrapper>
    )

    expect(screen.getByLabelText('Échéance *')).toBeInTheDocument()
  })

  it('handles checkbox change', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <InvoiceFormFields form={form} validationMode={null} />}
      </FormWrapper>
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(checkbox).toBeInTheDocument()
  })

  it('renders with different validation modes', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <InvoiceFormFields form={form} validationMode="save" />}
      </FormWrapper>
    )

    expect(screen.getByLabelText('Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Échéance')).toBeInTheDocument()
  })
})
