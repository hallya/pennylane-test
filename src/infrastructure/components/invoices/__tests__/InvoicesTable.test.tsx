import { render, screen } from '@testing-library/react'
import InvoicesTable from '../InvoicesTable'
import { InvoiceWithCustomerTestDataFactory } from '../../../../domain/__tests__/utils/invoiceWithCustomerTestDataFactory'
import { InvoiceTestDataFactory } from '../../../../domain/__tests__/utils/invoiceTestDataFactory'
import { InvoiceLineTestDataFactory } from '../../../../domain/__tests__/utils/invoiceLineTestDataFactory'
import { InvoiceEntity } from '../../../../domain/entities'

describe('InvoicesTable', () => {
  const mockInvoices = [
    InvoiceWithCustomerTestDataFactory.createPaidInvoiceWithCustomer({
      invoice: {
        id: 1,
        invoice_lines: [
          InvoiceLineTestDataFactory.create({
            id: 1,
            invoice_id: 1,
            quantity: 2,
            price: '100.00',
            tax: '20.00',
          }),
        ],
      },
      customer: { id: 1, first_name: 'John', last_name: 'Doe' },
    }),
    InvoiceWithCustomerTestDataFactory.createDueSoonInvoiceWithCustomer({
      invoice: {
        id: 2,
        invoice_lines: [
          InvoiceLineTestDataFactory.create({
            id: 2,
            invoice_id: 2,
            quantity: 1,
            price: '50.00',
            tax: '10.00',
          }),
        ],
      },
      customer: { id: 2, first_name: 'Jane', last_name: 'Smith' },
    }),
    new InvoiceEntity(
      InvoiceTestDataFactory.create({
        id: 3,
        customer_id: null,
        invoice_lines: [
          InvoiceLineTestDataFactory.create({
            id: 3,
            invoice_id: 3,
            quantity: 1,
            price: '75.00',
            tax: '15.00',
          }),
        ],
      })
    ),
  ]

  it('renders table with correct headers', () => {
    render(<InvoicesTable data={mockInvoices} />)

    expect(screen.getByText('Statut')).toBeInTheDocument()
    expect(screen.getByText('Prénom et nom du customer')).toBeInTheDocument()
    expect(screen.getByText("Date d'émission")).toBeInTheDocument()
    expect(screen.getByText('Échéance')).toBeInTheDocument()
    expect(screen.getByText('Total HT')).toBeInTheDocument()
    expect(screen.getByText('Total TVA')).toBeInTheDocument()
    expect(screen.getByText('Total TTC')).toBeInTheDocument()
    expect(screen.getByText('Total perçu')).toBeInTheDocument()
    expect(screen.getByText('ID')).toBeInTheDocument()
  })

  it('renders invoice data correctly', () => {
    render(<InvoicesTable data={mockInvoices} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    const dashes = screen.getAllByText('-')
    expect(dashes.length).toBeGreaterThan(0)

    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('#2')).toBeInTheDocument()
    expect(screen.getByText('#3')).toBeInTheDocument()
  })

  it('renders amounts correctly', () => {
    render(<InvoicesTable data={mockInvoices} />)

    expect(screen.getByText('160 €')).toBeInTheDocument()
    expect(screen.getAllByText('40 €')).toHaveLength(2)
    expect(screen.getAllByText('200 €')).toHaveLength(2)

    expect(screen.getByText('10 €')).toBeInTheDocument()
    expect(screen.getByText('50 €')).toBeInTheDocument()
    expect(screen.getByText('60 €')).toBeInTheDocument()
    expect(screen.getByText('15 €')).toBeInTheDocument()
    expect(screen.getByText('75 €')).toBeInTheDocument()
  })

  it('renders paid status correctly', () => {
    render(<InvoicesTable data={mockInvoices} />)

    const paidAmounts = screen.getAllByText('200 €')
    expect(paidAmounts.length).toBe(2)

    const dashes = screen.getAllByText('-')
    expect(dashes.length).toBeGreaterThan(0)
  })

  it('renders status labels correctly', () => {
    render(<InvoicesTable data={mockInvoices} />)

    expect(screen.getByText('Payée')).toBeInTheDocument()
    const pendingStatuses = screen.getAllByText('En attente de paiement')
    expect(pendingStatuses.length).toBe(2)
  })

  it('renders table with responsive wrapper', () => {
    render(<InvoicesTable data={mockInvoices} />)

    expect(screen.getByTestId('invoices-table-wrapper')).toBeInTheDocument()
  })

  it('renders empty data array', () => {
    render(<InvoicesTable data={[]} />)

    expect(screen.getByText('Statut')).toBeInTheDocument()
  })

  it('renders delete button when onDelete prop is provided', () => {
    const mockOnDelete = vi.fn()
    render(<InvoicesTable data={mockInvoices} onDelete={mockOnDelete} />)

    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('#2')).toBeInTheDocument()
    expect(screen.getByText('#3')).toBeInTheDocument()

    const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i })
    expect(deleteButtons).toHaveLength(3)
  })

  it('does not render delete button when onDelete prop is not provided', () => {
    render(<InvoicesTable data={mockInvoices} />)

    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('#2')).toBeInTheDocument()
    expect(screen.getByText('#3')).toBeInTheDocument()

    const deleteButtons = screen.queryAllByRole('button', { name: /supprimer/i })
    expect(deleteButtons).toHaveLength(0)
  })
})
