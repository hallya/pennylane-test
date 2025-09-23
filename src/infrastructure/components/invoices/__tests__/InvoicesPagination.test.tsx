import { render, screen, fireEvent } from '@testing-library/react'
import InvoicesPagination from '../InvoicesPagination'

vi.mock('react-bootstrap', () => ({
  Pagination: Object.assign(
    ({ children }: any) => <div data-testid="pagination">{children}</div>,
    {
      First: ({ children, disabled, onClick }: any) => (
        <button
          data-testid="pagination-first"
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </button>
      ),
      Prev: ({ children, disabled, onClick }: any) => (
        <button
          data-testid="pagination-prev"
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </button>
      ),
      Item: ({ children, active, onClick }: any) => (
        <button
          data-testid={`pagination-item-${children}`}
          data-active={active}
          onClick={onClick}
        >
          {children}
        </button>
      ),
      Next: ({ children, disabled, onClick }: any) => (
        <button
          data-testid="pagination-next"
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </button>
      ),
      Last: ({ children, disabled, onClick }: any) => (
        <button
          data-testid="pagination-last"
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </button>
      ),
    }
  ),
}))

describe('InvoicesPagination', () => {
  const mockOnPageChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when totalPages is 1', () => {
    render(
      <InvoicesPagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.queryByTestId('pagination-first')).not.toBeInTheDocument()
    expect(screen.queryByTestId('pagination-prev')).not.toBeInTheDocument()
    expect(screen.queryByTestId('pagination-next')).not.toBeInTheDocument()
    expect(screen.queryByTestId('pagination-last')).not.toBeInTheDocument()
  })

  it('renders nothing when totalPages is 0', () => {
    render(
      <InvoicesPagination
        currentPage={1}
        totalPages={0}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.queryByTestId('pagination-first')).not.toBeInTheDocument()
  })

  it('renders pagination controls when totalPages > 1', () => {
    render(
      <InvoicesPagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByTestId('pagination-first')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-prev')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-next')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-last')).toBeInTheDocument()

    expect(screen.getByTestId('pagination-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-item-2')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-item-3')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-item-4')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-item-5')).toBeInTheDocument()
  })

  it('marks current page as active', () => {
    render(
      <InvoicesPagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByTestId('pagination-item-3')).toHaveAttribute(
      'data-active',
      'true'
    )
    expect(screen.getByTestId('pagination-item-1')).toHaveAttribute(
      'data-active',
      'false'
    )
  })

  it('disables first and prev buttons on first page', () => {
    render(
      <InvoicesPagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByTestId('pagination-first')).toBeDisabled()
    expect(screen.getByTestId('pagination-prev')).toBeDisabled()
    expect(screen.getByTestId('pagination-next')).not.toBeDisabled()
    expect(screen.getByTestId('pagination-last')).not.toBeDisabled()
  })

  it('disables next and last buttons on last page', () => {
    render(
      <InvoicesPagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByTestId('pagination-first')).not.toBeDisabled()
    expect(screen.getByTestId('pagination-prev')).not.toBeDisabled()
    expect(screen.getByTestId('pagination-next')).toBeDisabled()
    expect(screen.getByTestId('pagination-last')).toBeDisabled()
  })

  it('calls onPageChange with correct page when clicking first', () => {
    render(
      <InvoicesPagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    fireEvent.click(screen.getByTestId('pagination-first'))
    expect(mockOnPageChange).toHaveBeenCalledWith(1)
  })

  it('calls onPageChange with correct page when clicking prev', () => {
    render(
      <InvoicesPagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    fireEvent.click(screen.getByTestId('pagination-prev'))
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with correct page when clicking next', () => {
    render(
      <InvoicesPagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    fireEvent.click(screen.getByTestId('pagination-next'))
    expect(mockOnPageChange).toHaveBeenCalledWith(4)
  })

  it('calls onPageChange with correct page when clicking last', () => {
    render(
      <InvoicesPagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    fireEvent.click(screen.getByTestId('pagination-last'))
    expect(mockOnPageChange).toHaveBeenCalledWith(5)
  })

  it('calls onPageChange with correct page when clicking page number', () => {
    render(
      <InvoicesPagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    fireEvent.click(screen.getByTestId('pagination-item-4'))
    expect(mockOnPageChange).toHaveBeenCalledWith(4)
  })

  it('renders correct number of page items', () => {
    render(
      <InvoicesPagination
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByTestId('pagination-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-item-2')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-item-3')).toBeInTheDocument()
    expect(screen.queryByTestId('pagination-item-4')).not.toBeInTheDocument()
  })
})
