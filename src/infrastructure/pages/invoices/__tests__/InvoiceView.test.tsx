import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import InvoiceView from '../InvoiceView'
import { InvoiceWithCustomerTestDataFactory } from '../../../../domain/__tests__/utils/invoiceWithCustomerTestDataFactory'
import { InvoiceTestDataFactory } from '../../../../domain/__tests__/utils/invoiceTestDataFactory'
import { InvoiceLineTestDataFactory } from '../../../../domain/__tests__/utils/invoiceLineTestDataFactory'
import { InvoiceEntity } from '../../../../domain/entities'

const mockUseGetInvoice = vi.fn()
vi.mock('../../../../adapters/controllers/invoices/useGetInvoice', () => ({
  useGetInvoice: (id: number | null) => mockUseGetInvoice(id),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
  }
})

const createTestInvoiceLine = (
  id: number,
  label: string,
  quantity: number,
  price: string,
  tax: string
) =>
  InvoiceLineTestDataFactory.create({
    id,
    invoice_id: id,
    label,
    quantity,
    price,
    tax,
    unit: 'hour',
  })

const createPaidInvoiceWithCustomer = () =>
  InvoiceWithCustomerTestDataFactory.createPaidInvoiceWithCustomer({
    invoice: {
      id: 1,
      finalized: true,
      paid: true,
      date: '2024-01-15',
      deadline: '2024-02-15',
      invoice_lines: [
        createTestInvoiceLine(
          1,
          'Service de développement',
          2,
          '100.00',
          '20.00'
        ),
      ],
    },
    customer: { id: 1, first_name: 'Jean', last_name: 'Dupont' },
  })

const createDraftInvoice = () =>
  new InvoiceEntity(
    InvoiceTestDataFactory.create({
      id: 2,
      customer_id: null,
      finalized: false,
      paid: false,
      date: '2024-01-20',
      deadline: null,
      invoice_lines: [
        createTestInvoiceLine(2, 'Consultation', 1, '150.00', '30.00'),
      ],
    })
  )

const renderInvoiceView = (mockData: any) => {
  mockUseGetInvoice.mockReturnValue(mockData)
  return render(
    <MemoryRouter>
      <InvoiceView />
    </MemoryRouter>
  )
}

const createMockHookResponse = (
  data: any,
  loading = false,
  error: string | null = null
) => ({
  data,
  loading,
  error,
})

describe('InvoiceView', () => {
  beforeEach(() => {
    mockUseGetInvoice.mockReset()
    mockNavigate.mockReset()
  })

  describe('Loading State', () => {
    it('renders loading message when invoice is loading', () => {
      renderInvoiceView(createMockHookResponse(null, true, null))

      expect(
        screen.getByText('Chargement de la facture...')
      ).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('renders error message when there is an error', () => {
      renderInvoiceView(
        createMockHookResponse(null, false, 'Erreur de chargement')
      )

      expect(
        screen.getByText(
          'Erreur lors du chargement de la facture: Erreur de chargement'
        )
      ).toBeInTheDocument()
      expect(screen.getByText('Retour aux factures')).toBeInTheDocument()
    })

    it('navigates back to invoices when return button is clicked', () => {
      renderInvoiceView(
        createMockHookResponse(null, false, 'Erreur de chargement')
      )

      const returnButton = screen.getByText('Retour aux factures')
      fireEvent.click(returnButton)
      expect(mockNavigate).toHaveBeenCalledWith('/invoices')
    })
  })

  describe('Not Found State', () => {
    it('renders not found message when invoice is null', () => {
      renderInvoiceView(createMockHookResponse(null, false, null))

      expect(screen.getByText('Facture non trouvée.')).toBeInTheDocument()
      expect(screen.getByText('Retour aux factures')).toBeInTheDocument()
    })
  })

  describe('Success State - Finalized Invoice', () => {
    it('renders invoice header with correct ID', () => {
      renderInvoiceView(createMockHookResponse(createPaidInvoiceWithCustomer()))

      expect(screen.getByRole('heading', { name: /facture #1/i })).toBeInTheDocument()
    })

    it('renders customer information correctly', () => {
      renderInvoiceView(createMockHookResponse(createPaidInvoiceWithCustomer()))

      expect(screen.getByRole('heading', { name: /informations client/i })).toBeInTheDocument()
      expect(screen.getByText('Jean Dupont')).toBeInTheDocument()
      expect(screen.getByText('#1')).toBeInTheDocument()
    })

    it('renders invoice information correctly', () => {
      renderInvoiceView(createMockHookResponse(createPaidInvoiceWithCustomer()))

      expect(screen.getByRole('heading', { name: /informations facture/i })).toBeInTheDocument()
      expect(screen.getByText('15/01/2024')).toBeInTheDocument()
      expect(screen.getByText('15/02/2024')).toBeInTheDocument()
      expect(screen.getByText('Payée')).toBeInTheDocument()
      expect(screen.getByText('Finalisée')).toBeInTheDocument()
    })

    it('renders invoice lines table correctly', () => {
      renderInvoiceView(createMockHookResponse(createPaidInvoiceWithCustomer()))

      expect(screen.getByRole('heading', { name: /lignes de facture/i })).toBeInTheDocument()
      
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
      
      expect(screen.getByRole('columnheader', { name: /produit/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /quantité/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /unité/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /prix unitaire/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /tva/i })).toBeInTheDocument()
      
      expect(screen.getByRole('cell', { name: /service de développement/i })).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: '2' })).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: 'hour' })).toBeInTheDocument()
    })

    it('renders totals correctly', () => {
      renderInvoiceView(createMockHookResponse(createPaidInvoiceWithCustomer()))

      const totalHTElements = screen.getAllByText('160 €')
      expect(totalHTElements).toHaveLength(2)
      
      expect(screen.getByText('40 €')).toBeInTheDocument()
      
      const totalTTCElements = screen.getAllByText('200 €')
      expect(totalTTCElements).toHaveLength(3)
    })

    it('renders paid amount section for paid invoices', () => {
      renderInvoiceView(createMockHookResponse(createPaidInvoiceWithCustomer()))

      expect(screen.getByText('Total perçu:')).toBeInTheDocument()
      
      const paidAmountElements = screen.getAllByText('200 €')
      expect(paidAmountElements).toHaveLength(3)
    })

    it('does not render edit button for paid invoices', () => {
      renderInvoiceView(createMockHookResponse(createPaidInvoiceWithCustomer()))

      expect(screen.queryByText('Modifier')).not.toBeInTheDocument()
    })

    it('renders return button', () => {
      renderInvoiceView(createMockHookResponse(createPaidInvoiceWithCustomer()))

      expect(screen.getByRole('button', { name: /retour aux factures/i })).toBeInTheDocument()
    })
  })

  describe('Success State - Draft Invoice', () => {
    it('renders draft finalization status', () => {
      renderInvoiceView(createMockHookResponse(createDraftInvoice()))

      expect(screen.getByText('Brouillon')).toBeInTheDocument()
    })

    it('renders unpaid status for draft invoices', () => {
      renderInvoiceView(createMockHookResponse(createDraftInvoice()))

      expect(screen.getByText('Non payée')).toBeInTheDocument()
    })

    it('renders edit button for unpaid invoices', () => {
      renderInvoiceView(createMockHookResponse(createDraftInvoice()))

      expect(screen.getByRole('button', { name: /modifier/i })).toBeInTheDocument()
    })

    it('navigates to edit page when edit button is clicked', () => {
      renderInvoiceView(createMockHookResponse(createDraftInvoice()))

      const editButton = screen.getByRole('button', { name: /modifier/i })
      fireEvent.click(editButton)
      expect(mockNavigate).toHaveBeenCalledWith('/invoices/edit/2')
    })

    it('handles null dates correctly', () => {
      renderInvoiceView(createMockHookResponse(createDraftInvoice()))

      expect(screen.getByText('-')).toBeInTheDocument()
    })

    it('handles invoices without customers correctly', () => {
      renderInvoiceView(createMockHookResponse(createDraftInvoice()))

      expect(screen.getByText('Aucun client associé')).toBeInTheDocument()
    })

    it('does not render paid amount section for unpaid invoices', () => {
      renderInvoiceView(createMockHookResponse(createDraftInvoice()))

      expect(screen.queryByText('Total perçu:')).not.toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('navigates back when return button is clicked', () => {
      renderInvoiceView(createMockHookResponse(createPaidInvoiceWithCustomer()))

      const returnButton = screen.getByRole('button', { name: /retour aux factures/i })
      fireEvent.click(returnButton)
      expect(mockNavigate).toHaveBeenCalledWith('/invoices')
    })

    it('renders with correct URL parameter', () => {
      renderInvoiceView(createMockHookResponse(createPaidInvoiceWithCustomer()))

      expect(mockUseGetInvoice).toHaveBeenCalledWith(1)
    })
  })

  describe('Currency Formatting', () => {
    it('formats currency values correctly', () => {
      renderInvoiceView(createMockHookResponse(createPaidInvoiceWithCustomer()))

      expect(screen.getByText('100 €')).toBeInTheDocument()
      expect(screen.getByText('20 €')).toBeInTheDocument()
      expect(screen.getByText('40 €')).toBeInTheDocument()
      
      const totalHTElements = screen.getAllByText('160 €')
      expect(totalHTElements).toHaveLength(2)
      
      const totalTTCElements = screen.getAllByText('200 €')
      expect(totalTTCElements).toHaveLength(3)
    })
  })

  describe('Badge Styling', () => {
    it('applies correct Bootstrap classes for payment status', () => {
      renderInvoiceView(createMockHookResponse(createPaidInvoiceWithCustomer()))

      const paidBadge = screen.getByText('Payée')
      const finalizedBadge = screen.getByText('Finalisée')

      expect(paidBadge).toHaveClass('bg-success')
      expect(finalizedBadge).toHaveClass('bg-success')
    })

    it('applies correct Bootstrap classes for draft status', () => {
      renderInvoiceView(createMockHookResponse(createDraftInvoice()))

      const unpaidBadge = screen.getByText('Non payée')
      const draftBadge = screen.getByText('Brouillon')

      expect(unpaidBadge).toHaveClass('bg-warning')
      expect(draftBadge).toHaveClass('bg-secondary')
    })
  })
})
