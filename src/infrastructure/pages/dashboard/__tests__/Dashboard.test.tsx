import { render, screen } from '@testing-library/react'
import Dashboard from '../Dashboard'
import { DashboardTestDataFactory } from '../../../__tests__/utils/dashboardTestDataFactory'
import { useDashboard } from '../../../../adapters/controllers'

vi.mock('../../../../adapters/controllers', () => ({
  useDashboard: vi.fn(),
}))

vi.mock('../DashboardLoading', () => ({
  default: () => <div data-testid="dashboard-loading">Loading...</div>,
}))

vi.mock('../DashboardError', () => ({
  default: ({ error }: { error: string }) => (
    <div data-testid="dashboard-error">Error: {error}</div>
  ),
}))

vi.mock('../DashboardEmpty', () => ({
  default: () => <div data-testid="dashboard-empty">No data</div>,
}))

vi.mock('../../../components', () => ({
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

describe('Dashboard', () => {
  beforeEach(() => {
    vi.mocked(useDashboard).mockImplementation(vi.fn())
    vi.clearAllMocks()
  })

  it('displays loading state', () => {
    vi.mocked(useDashboard).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    })

    render(<Dashboard />)

    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument()

    expect(screen.queryByTestId('dashboard-error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('dashboard-empty')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })

  it('displays error state', () => {
    const errorMessage = 'Test error'
    vi.mocked(useDashboard).mockReturnValue({
      data: null,
      loading: false,
      error: errorMessage,
    })

    render(<Dashboard />)

    expect(screen.getByTestId('dashboard-error')).toBeInTheDocument()
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()

    expect(screen.queryByTestId('dashboard-loading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('dashboard-empty')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })

  it('displays no data state', () => {
    vi.mocked(useDashboard).mockReturnValue({
      data: null,
      loading: false,
      error: null,
    })

    render(<Dashboard />)

    expect(screen.getByTestId('dashboard-empty')).toBeInTheDocument()

    expect(screen.queryByTestId('dashboard-loading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('dashboard-error')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })

  it('renders dashboard with data', () => {
    const mockData = DashboardTestDataFactory.createDashboardData()
    vi.mocked(useDashboard).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    })

    render(<Dashboard />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Dashboard Financier' })
    ).toBeInTheDocument()

    const skipLink = screen.getByText('Aller au contenu principal')
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveAttribute('href', '#dashboard-title')

    expect(screen.getByTestId('cash-flow-widget')).toBeInTheDocument()
    expect(screen.getByTestId('deadline-widget')).toBeInTheDocument()
    expect(screen.getByTestId('client-reliability-widget')).toBeInTheDocument()
    expect(screen.getByTestId('revenue-structure-widget')).toBeInTheDocument()

    expect(screen.queryByTestId('dashboard-loading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('dashboard-error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('dashboard-empty')).not.toBeInTheDocument()
  })
})
