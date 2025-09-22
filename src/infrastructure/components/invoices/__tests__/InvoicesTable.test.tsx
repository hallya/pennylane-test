import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import InvoicesTable from '../InvoicesTable'
import { InvoiceWithCustomerTestDataFactory } from '../../../../domain/__tests__/utils/invoiceWithCustomerTestDataFactory'
import { InvoiceTestDataFactory } from '../../../../domain/__tests__/utils/invoiceTestDataFactory'
import { InvoiceLineTestDataFactory } from '../../../../domain/__tests__/utils/invoiceLineTestDataFactory'
import { InvoiceEntity } from '../../../../domain/entities'

const mockConfirm = vi.fn()
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: mockConfirm,
})

describe('InvoicesTable', () => {
  let mockInvoices: InvoiceEntity[]
  let mockOnDelete: ReturnType<typeof vi.fn>
  let mockOnEdit: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockOnDelete = vi.fn()
    mockOnEdit = vi.fn()
    mockConfirm.mockReset()

    mockInvoices = [
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

      InvoiceWithCustomerTestDataFactory.createOverdueInvoiceWithCustomer({
        invoice: {
          id: 3,
          invoice_lines: [
            InvoiceLineTestDataFactory.create({
              id: 3,
              invoice_id: 3,
              quantity: 1,
              price: '75.00',
              tax: '15.00',
            }),
          ],
        },
        customer: { id: 3, first_name: 'Bob', last_name: 'Wilson' },
      }),

      new InvoiceEntity(
        InvoiceTestDataFactory.create({
          id: 4,
          customer_id: null,
          finalized: false,
          invoice_lines: [
            InvoiceLineTestDataFactory.create({
              id: 4,
              invoice_id: 4,
              quantity: 1,
              price: '200.00',
              tax: '40.00',
            }),
          ],
        })
      ),

      new InvoiceEntity(
        InvoiceTestDataFactory.create({
          id: 5,
          customer_id: null,
          finalized: true,
          invoice_lines: [
            InvoiceLineTestDataFactory.create({
              id: 5,
              invoice_id: 5,
              quantity: 3,
              price: '150.00',
              tax: '45.00',
            }),
          ],
        })
      ),
    ]
  })

  describe('Basic Rendering', () => {
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
    
    it('renders empty data array', () => {
      render(<InvoicesTable data={[]} />)

      expect(screen.getByText('Statut')).toBeInTheDocument()
      expect(
        screen.queryByRole('row', { name: /invoice data/i })
      ).not.toBeInTheDocument()
    })
  })

  describe('Invoice Data Display', () => {
    it('renders all invoice data correctly', () => {
      render(<InvoicesTable data={mockInvoices} />)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument()

      const dashes = screen.getAllByText('-')
      expect(dashes.length).toBeGreaterThan(0)

      expect(screen.getByText('#1')).toBeInTheDocument()
      expect(screen.getByText('#2')).toBeInTheDocument()
      expect(screen.getByText('#3')).toBeInTheDocument()
      expect(screen.getByText('#4')).toBeInTheDocument()
      expect(screen.getByText('#5')).toBeInTheDocument()
    })

    it('renders amounts correctly', () => {
      render(<InvoicesTable data={mockInvoices} />)

      expect(screen.getAllByText('160 €')).toHaveLength(2)
      expect(screen.getAllByText('40 €')).toHaveLength(3)
      expect(screen.getAllByText('200 €')).toHaveLength(3)

      expect(screen.getByText('10 €')).toBeInTheDocument()
      expect(screen.getByText('50 €')).toBeInTheDocument()
      expect(screen.getByText('60 €')).toBeInTheDocument()

      expect(screen.getByText('15 €')).toBeInTheDocument()
      expect(screen.getByText('75 €')).toBeInTheDocument()
    })

    it('renders paid amounts correctly', () => {
      render(<InvoicesTable data={mockInvoices} />)

      expect(screen.getAllByText('200 €')).toHaveLength(3)

      const dashes = screen.getAllByText('-')
      expect(dashes.length).toBeGreaterThan(0)
    })
  })

  describe('Invoice Status Display', () => {
    it('renders all status labels correctly', () => {
      render(<InvoicesTable data={mockInvoices} />)

      expect(screen.getByText('Payée')).toBeInTheDocument()
      expect(screen.getByText('En retard de paiement')).toBeInTheDocument()
      expect(screen.getByText('À finaliser')).toBeInTheDocument()

      expect(screen.getAllByText('En attente de paiement')).toHaveLength(2)
    })

    it('applies correct Bootstrap classes for different statuses', () => {
      render(<InvoicesTable data={mockInvoices} />)

      const statusCells = screen
        .getAllByRole('cell')
        .filter(
          (cell) =>
            cell.textContent === 'Payée' ||
            cell.textContent === 'Échéance proche' ||
            cell.textContent === 'En retard de paiement' ||
            cell.textContent === 'À finaliser' ||
            cell.textContent === 'En attente de paiement'
        )

      const cellsWithClasses = statusCells.filter(
        (cell) =>
          cell.className.includes('text-success') ||
          cell.className.includes('text-warning') ||
          cell.className.includes('text-danger') ||
          cell.className.includes('text-secondary')
      )
      expect(cellsWithClasses.length).toBeGreaterThan(0)
    })

    it('applies overdue styling to deadline column', () => {
      render(<InvoicesTable data={mockInvoices} />)

      const deadlineCells = screen
        .getAllByRole('cell')
        .filter((cell) => cell.textContent && cell.textContent.includes('/'))

      const overdueCells = deadlineCells.filter((cell) =>
        cell.className.includes('text-danger')
      )
      expect(overdueCells.length).toBeGreaterThan(0)
    })

    it('applies due soon styling to deadline column', () => {
      render(<InvoicesTable data={mockInvoices} />)

      const deadlineCells = screen
        .getAllByRole('cell')
        .filter((cell) => cell.textContent && cell.textContent.includes('/'))

      const dueSoonCells = deadlineCells.filter((cell) =>
        cell.className.includes('text-warning')
      )
      expect(dueSoonCells.length).toBeGreaterThan(0)
    })
  })

  describe('Date Formatting', () => {
    it('formats dates correctly in French locale', () => {
      render(<InvoicesTable data={mockInvoices} />)

      const dateCells = screen
        .getAllByRole('cell')
        .filter(
          (cell) =>
            cell.textContent && /^\d{2}\/\d{2}\/\d{4}$/.test(cell.textContent)
        )
      expect(dateCells.length).toBeGreaterThan(0)
    })

    it('displays dash for null dates', () => {
      render(<InvoicesTable data={mockInvoices} />)

      const dashes = screen.getAllByText('-')
      expect(dashes.length).toBeGreaterThan(0)
    })
  })

  describe('Action Buttons', () => {
    it('renders edit button only for non-finalized invoices when onEdit is provided', () => {
      render(<InvoicesTable data={mockInvoices} onEdit={mockOnEdit} />)

      const editButtons = screen.getAllByTitle('Modifier la facture')
      expect(editButtons.length).toBe(4)

      fireEvent.click(editButtons[0])
      expect(mockOnEdit).toHaveBeenCalledWith(2)
    })

    it('does not render edit button for finalized invoices', () => {
      render(<InvoicesTable data={mockInvoices} onEdit={mockOnEdit} />)

      const editButtons = screen.getAllByTitle('Modifier la facture')
      expect(editButtons.length).toBe(4)
    })

    it('renders delete button only for non-finalized invoices when onDelete is provided', () => {
      render(<InvoicesTable data={mockInvoices} onDelete={mockOnDelete} />)

      const deleteButtons = screen.getAllByTitle('Supprimer la facture')
      expect(deleteButtons.length).toBe(4)
    })

    it('does not render delete button for finalized invoices', () => {
      render(<InvoicesTable data={mockInvoices} onDelete={mockOnDelete} />)

      const deleteButtons = screen.getAllByTitle('Supprimer la facture')
      expect(deleteButtons.length).toBe(4)
    })

    it('does not render action buttons when callbacks are not provided', () => {
      render(<InvoicesTable data={mockInvoices} />)

      const editButtons = screen.queryAllByTitle('Modifier la facture')
      const deleteButtons = screen.queryAllByTitle('Supprimer la facture')

      expect(editButtons).toHaveLength(0)
      expect(deleteButtons).toHaveLength(0)
    })

    it('shows confirmation dialog when delete button is clicked', async () => {
      mockConfirm.mockReturnValue(true)
      render(<InvoicesTable data={mockInvoices} onDelete={mockOnDelete} />)

      const deleteButtons = screen.getAllByTitle('Supprimer la facture')
      fireEvent.click(deleteButtons[0])

      expect(mockConfirm).toHaveBeenCalledWith(
        'Êtes-vous sûr de vouloir supprimer cette facture ?'
      )
    })

    it('calls onDelete when user confirms deletion', async () => {
      mockConfirm.mockReturnValue(true)
      render(<InvoicesTable data={mockInvoices} onDelete={mockOnDelete} />)

      const deleteButtons = screen.getAllByTitle('Supprimer la facture')
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalledWith(2)
      })
    })

    it('does not call onDelete when user cancels deletion', async () => {
      mockConfirm.mockReturnValue(false)
      render(<InvoicesTable data={mockInvoices} onDelete={mockOnDelete} />)

      const deleteButtons = screen.getAllByTitle('Supprimer la facture')
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(mockOnDelete).not.toHaveBeenCalled()
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles invoices without customers correctly', () => {
      render(<InvoicesTable data={mockInvoices} />)

      const dashes = screen.getAllByText('-')
      expect(dashes.length).toBeGreaterThan(0)
    })

    it('handles invoices with null dates correctly', () => {
      render(<InvoicesTable data={mockInvoices} />)

      const dashes = screen.getAllByText('-')
      expect(dashes.length).toBeGreaterThan(0)
    })

    it('handles single invoice correctly', () => {
      const singleInvoice = [mockInvoices[0]]
      render(<InvoicesTable data={singleInvoice} />)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('#1')).toBeInTheDocument()
      expect(screen.getByText('Payée')).toBeInTheDocument()
    })

    it('handles large number of invoices', () => {
      const manyInvoices = Array.from({ length: 100 }, (_, i) =>
        InvoiceWithCustomerTestDataFactory.createPaidInvoiceWithCustomer({
          invoice: {
            id: i + 1,
            invoice_lines: [
              InvoiceLineTestDataFactory.create({
                id: i + 1,
                invoice_id: i + 1,
                quantity: 1,
                price: '100.00',
                tax: '20.00',
              }),
            ],
          },
          customer: {
            id: i + 1,
            first_name: `Customer${i + 1}`,
            last_name: 'Test',
          },
        })
      )

      render(<InvoicesTable data={manyInvoices} />)

      expect(screen.getByText('Customer1 Test')).toBeInTheDocument()
      expect(screen.getByText('#100')).toBeInTheDocument()
    })
  })
})

