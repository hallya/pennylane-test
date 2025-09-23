import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import InvoicesTable, { InvoicesTableProps } from '../InvoicesTable'
import { InvoiceWithCustomerTestDataFactory } from '../../../../domain/__tests__/utils/invoiceWithCustomerTestDataFactory'
import { InvoiceTestDataFactory } from '../../../../domain/__tests__/utils/invoiceTestDataFactory'
import { InvoiceLineTestDataFactory } from '../../../../domain/__tests__/utils/invoiceLineTestDataFactory'
import { InvoiceEntity } from '../../../../domain/entities'
import { Mock } from 'vitest'

const mockConfirm = vi.fn()
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: mockConfirm,
})

describe('InvoicesTable', () => {
  let mockInvoices: InvoiceEntity[]
  let mockOnDelete: Mock
  let mockOnEdit: Mock
  let mockOnView: Mock
  let defaultProps: InvoicesTableProps

  beforeEach(() => {
    mockOnDelete = vi.fn()
    mockOnEdit = vi.fn()
    mockOnView = vi.fn()
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

    defaultProps = {
      data: mockInvoices,
      onEdit: mockOnEdit,
      onDelete: mockOnDelete,
      onView: mockOnView,
    }
  })

  describe('Basic Rendering', () => {
    it('renders table with correct headers', () => {
      render(<InvoicesTable {...defaultProps} />)

      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()

      expect(
        screen.getByRole('columnheader', { name: /statut/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /prénom et nom du customer/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /date d'émission/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /échéance/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /total ht/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /total tva/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /total ttc/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /total perçu/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /id/i })
      ).toBeInTheDocument()
    })

    it('renders empty data array', () => {
      render(
        <InvoicesTable
          data={[]}
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      )

      expect(screen.getByText('Statut')).toBeInTheDocument()
      expect(
        screen.queryByRole('row', { name: /invoice data/i })
      ).not.toBeInTheDocument()
    })
  })

  describe('Invoice Data Display', () => {
    it('renders all invoice data correctly', () => {
      render(<InvoicesTable {...defaultProps} />)

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
      render(<InvoicesTable {...defaultProps} />)

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
      render(<InvoicesTable {...defaultProps} />)

      expect(screen.getAllByText('200 €')).toHaveLength(3)

      const dashes = screen.getAllByText('-')
      expect(dashes.length).toBeGreaterThan(0)
    })
  })

  describe('Invoice Status Display', () => {
    it('renders all status labels correctly', () => {
      render(<InvoicesTable {...defaultProps} />)

      expect(screen.getByText('Payée')).toBeInTheDocument()
      expect(screen.getByText('En retard de paiement')).toBeInTheDocument()
      expect(screen.getByText('À finaliser')).toBeInTheDocument()

      expect(screen.getAllByText('En attente de paiement')).toHaveLength(2)
    })

    it('applies correct Bootstrap classes for different statuses', () => {
      render(<InvoicesTable {...defaultProps} />)

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
      render(<InvoicesTable {...defaultProps} />)

      const deadlineCells = screen
        .getAllByRole('cell')
        .filter((cell) => cell.textContent && cell.textContent.includes('/'))

      const overdueCells = deadlineCells.filter((cell) =>
        cell.className.includes('text-danger')
      )
      expect(overdueCells.length).toBeGreaterThan(0)
    })

    it('applies due soon styling to deadline column', () => {
      render(<InvoicesTable {...defaultProps} />)

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
      render(<InvoicesTable {...defaultProps} />)

      const dateCells = screen
        .getAllByRole('cell')
        .filter(
          (cell) =>
            cell.textContent && /^\d{2}\/\d{2}\/\d{4}$/.test(cell.textContent)
        )
      expect(dateCells.length).toBeGreaterThan(0)
    })

    it('displays dash for null dates', () => {
      render(<InvoicesTable {...defaultProps} />)

      const dashes = screen.getAllByText('-')
      expect(dashes.length).toBeGreaterThan(0)
    })
  })

  describe('View Button', () => {
    it('renders view button for all invoices', () => {
      render(<InvoicesTable {...defaultProps} />)

      const viewButtons = screen.queryAllByRole('button', {
        name: 'Voir la facture',
      })
      expect(viewButtons.length).toBe(5)

      expect(viewButtons[0]).toHaveClass(
        'btn',
        'btn-sm',
        'btn-outline-info',
        'ms-2'
      )
      expect(viewButtons[0]).toHaveAttribute('title', 'Voir la facture')
    })

    it('calls onView when view button is clicked', () => {
      render(<InvoicesTable {...defaultProps} />)

      const viewButtons = screen.getAllByRole('button', {
        name: 'Voir la facture',
      })
      fireEvent.click(viewButtons[0])

      expect(mockOnView).toHaveBeenCalledWith(1)
    })
  })

  describe('Edit Button Display', () => {
    it('renders edit button only for unpaid invoices', () => {
      render(<InvoicesTable {...defaultProps} />)

      const editButtons = screen.getAllByTitle('Modifier la facture')
      expect(editButtons.length).toBe(4)

      expect(editButtons[0]).toHaveClass(
        'btn',
        'btn-sm',
        'btn-outline-primary',
        'ms-2'
      )
      expect(editButtons[0]).toHaveAttribute('title', 'Modifier la facture')
    })

    it('does not render edit button for paid invoices', () => {
      render(
        <InvoicesTable
          {...defaultProps}
          data={[
            InvoiceWithCustomerTestDataFactory.createPaidInvoiceWithCustomer(),
          ]}
        />
      )

      const editButtonInFirstRow = screen.queryByRole('button', {
        name: 'Modifier la facture',
      })
      expect(editButtonInFirstRow).not.toBeInTheDocument()
    })

    it('renders edit button with correct icon', () => {
      render(<InvoicesTable {...defaultProps} />)

      const editButtons = screen.getAllByTitle('Modifier la facture')
      const icon = editButtons[0].querySelector('i')

      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('bi', 'bi-pencil')
    })

    it('calls onEdit when edit button is clicked', () => {
      render(<InvoicesTable {...defaultProps} />)

      const editButtons = screen.getAllByTitle('Modifier la facture')
      fireEvent.click(editButtons[0])

      expect(mockOnEdit).toHaveBeenCalledWith(2)
    })
  })

  describe('Delete Button Display', () => {
    it('renders delete button only for unpaid invoices', () => {
      render(<InvoicesTable {...defaultProps} />)

      const deleteButtons = screen.getAllByTitle('Supprimer la facture')
      expect(deleteButtons.length).toBe(4)

      expect(deleteButtons[0]).toHaveClass(
        'btn',
        'btn-sm',
        'btn-outline-danger',
        'ms-2'
      )
      expect(deleteButtons[0]).toHaveAttribute('title', 'Supprimer la facture')
    })

    it('does not render delete button for paid invoices', () => {
      render(<InvoicesTable {...defaultProps} />)

      const firstRow = screen.getByText('#1').closest('tr')
      const deleteButtonInFirstRow = firstRow?.querySelector(
        '[title="Supprimer la facture"]'
      )
      expect(deleteButtonInFirstRow).not.toBeInTheDocument()
    })

    it('renders delete button with correct icon', () => {
      render(<InvoicesTable {...defaultProps} />)

      const deleteButtons = screen.getAllByTitle('Supprimer la facture')
      const icon = deleteButtons[0].querySelector('i')

      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('bi', 'bi-trash')
    })

    it('shows confirmation dialog when delete button is clicked', async () => {
      mockConfirm.mockReturnValue(true)
      render(<InvoicesTable {...defaultProps} />)

      const deleteButtons = screen.getAllByTitle('Supprimer la facture')
      fireEvent.click(deleteButtons[0])

      expect(mockConfirm).toHaveBeenCalledWith(
        'Êtes-vous sûr de vouloir supprimer cette facture ?'
      )
    })

    it('calls onDelete when user confirms deletion', async () => {
      mockConfirm.mockReturnValue(true)
      render(<InvoicesTable {...defaultProps} />)

      const deleteButtons = screen.getAllByTitle('Supprimer la facture')
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalledWith(2)
      })
    })

    it('does not call onDelete when user cancels deletion', async () => {
      mockConfirm.mockReturnValue(false)
      render(<InvoicesTable {...defaultProps} />)

      const deleteButtons = screen.getAllByTitle('Supprimer la facture')
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(mockOnDelete).not.toHaveBeenCalled()
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles invoices without customers correctly', () => {
      render(<InvoicesTable {...defaultProps} />)

      const dashes = screen.getAllByText('-')
      expect(dashes.length).toBeGreaterThan(0)
    })

    it('handles invoices with null dates correctly', () => {
      render(<InvoicesTable {...defaultProps} />)

      const dashes = screen.getAllByText('-')
      expect(dashes.length).toBeGreaterThan(0)
    })

    it('handles single invoice correctly', () => {
      const singleInvoice = [mockInvoices[0]]
      render(<InvoicesTable {...defaultProps} data={singleInvoice} />)

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

      render(<InvoicesTable {...defaultProps} data={manyInvoices} />)

      expect(screen.getByText('Customer1 Test')).toBeInTheDocument()
      expect(screen.getByText('#100')).toBeInTheDocument()
    })
  })
})
