import { render, screen, fireEvent } from '@testing-library/react'
import InvoicesPagination from '../InvoicesPagination'

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

    expect(
      screen.queryByRole('button', { name: 'First' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Previous' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Last' })
    ).not.toBeInTheDocument()
  })

  it('renders nothing when totalPages is 0', () => {
    render(
      <InvoicesPagination
        currentPage={1}
        totalPages={0}
        onPageChange={mockOnPageChange}
      />
    )

    expect(
      screen.queryByRole('button', { name: 'First' })
    ).not.toBeInTheDocument()
  })

  it('renders pagination controls when totalPages > 1', () => {
    render(
      <InvoicesPagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Last' })).toBeInTheDocument()

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
  })

  it('sets aria-current on active page', () => {
    render(
      <InvoicesPagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByText('3')).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.getByRole('button', { name: '1' })).not.toHaveAttribute(
      'aria-current'
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

    expect(screen.queryByRole('button', { name: 'First' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).not.toHaveAttribute(
      'aria-disabled'
    )
    expect(screen.getByRole('button', { name: 'Last' })).not.toHaveAttribute(
      'aria-disabled'
    )
  })

  it('disables next and last buttons on last page', () => {
    render(
      <InvoicesPagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByRole('button', { name: 'First' })).not.toHaveAttribute(
      'aria-disabled'
    )
    expect(
      screen.getByRole('button', { name: 'Previous' })
    ).not.toHaveAttribute('aria-disabled')
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Last' })).not.toBeInTheDocument()
  })

  it('calls onPageChange with correct page when clicking first', () => {
    render(
      <InvoicesPagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'First' }))
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

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
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

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
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

    fireEvent.click(screen.getByRole('button', { name: 'Last' }))
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

    fireEvent.click(screen.getByRole('button', { name: '4' }))
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

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '4' })).not.toBeInTheDocument()
  })
})
