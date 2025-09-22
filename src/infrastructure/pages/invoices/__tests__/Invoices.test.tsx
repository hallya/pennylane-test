import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Invoices from '../Invoices'
import { useInvoices } from '../../../../adapters/controllers'

vi.mock('../../../../adapters/controllers', () => ({
  useInvoices: vi.fn(),
  useDeleteInvoice: () => ({
    deleteInvoice: vi.fn(),
    loading: false,
    error: null,
  }),
}))

vi.mock('../../components', () => ({
  InvoicesTable: ({ data }: any) => (
    <div data-testid="invoices-table">
      Table with {data?.length || 0} invoices
    </div>
  ),
  InvoicesPagination: ({ currentPage, totalPages, onPageChange }: any) => (
    <div data-testid="invoices-pagination">
      Pagination: page {currentPage} of {totalPages}
    </div>
  ),
  CashFlowWidget: ({ data }: any) => (
    <div data-testid="cash-flow-widget">CashFlow: {JSON.stringify(data)}</div>
  ),
  DeadlineWidget: ({ data }: any) => (
    <div data-testid="deadline-widget">Deadline: {JSON.stringify(data)}</div>
  ),
  ClientReliabilityWidget: ({ data }: any) => (
    <div data-testid="client-reliability-widget">
      ClientReliability: {JSON.stringify(data)}
    </div>
  ),
  RevenueStructureWidget: ({ data }: any) => (
    <div data-testid="revenue-structure-widget">
      RevenueStructure: {JSON.stringify(data)}
    </div>
  ),
}))

vi.mock('react-router-dom', () => ({
  Link: ({ to, children }: any) => (
    <a href={to} data-testid="link">
      {children}
    </a>
  ),
  useNavigate: vi.fn(),
}))

describe('Invoices', () => {
  beforeEach(() => {
    vi.mocked(useInvoices).mockClear()
  })

  it('displays loading state', () => {
    vi.mocked(useInvoices).mockReturnValue({
      data: null,
      loading: true,
      error: null,
      pagination: null,
      refetch: vi.fn(),
    })

    render(<Invoices />)

    expect(screen.getByText('Factures')).toBeInTheDocument()
    expect(screen.getByText('Chargement des factures...')).toBeInTheDocument()
    expect(screen.queryByTestId('invoices-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('invoices-pagination')).not.toBeInTheDocument()
  })

  it('displays error state', () => {
    const errorMessage = 'Network error'
    vi.mocked(useInvoices).mockReturnValue({
      data: null,
      loading: false,
      error: errorMessage,
      pagination: null,
      refetch: vi.fn(),
    })

    render(<Invoices />)

    expect(screen.getByText('Factures')).toBeInTheDocument()
    expect(
      screen.getByText(
        `Erreur lors du chargement des factures: ${errorMessage}`
      )
    ).toBeInTheDocument()
    expect(screen.queryByTestId('invoices-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('invoices-pagination')).not.toBeInTheDocument()
  })

  it('displays no data state', () => {
    vi.mocked(useInvoices).mockReturnValue({
      data: null,
      loading: false,
      error: null,
      pagination: null,
      refetch: vi.fn(),
    })

    render(<Invoices />)

    expect(screen.getByText('Factures')).toBeInTheDocument()
    expect(screen.getByText('Aucune facture trouvée.')).toBeInTheDocument()
    expect(screen.queryByTestId('invoices-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('invoices-pagination')).not.toBeInTheDocument()
  })

  it('displays empty data array', () => {
    vi.mocked(useInvoices).mockReturnValue({
      data: [],
      loading: false,
      error: null,
      pagination: { page: 1, page_size: 50, total_pages: 1, total_entries: 0 },
      refetch: vi.fn(),
    })

    render(<Invoices />)

    expect(screen.getByText('Factures')).toBeInTheDocument()
    expect(screen.getByText('Aucune facture trouvée.')).toBeInTheDocument()
    expect(screen.queryByTestId('invoices-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('invoices-pagination')).not.toBeInTheDocument()
  })

})
