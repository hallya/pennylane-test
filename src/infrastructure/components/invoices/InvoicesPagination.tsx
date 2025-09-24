import React from 'react'
import { Pagination } from 'react-bootstrap'

interface InvoicesPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const InvoicesPagination: React.FC<InvoicesPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null

  return (
    <div className="d-flex justify-content-center mt-3">
      <Pagination>
        <Pagination.First
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          aria-disabled={currentPage === 1}
          aria-label="First"
        />
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-disabled={currentPage === 1}
          aria-label="Previous"
        />
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-disabled={currentPage === totalPages}
          aria-label="Next"
        />
        <Pagination.Last
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-disabled={currentPage === totalPages}
          aria-label="Last"
        />
      </Pagination>
    </div>
  )
}

export default InvoicesPagination
