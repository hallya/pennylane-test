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
        />
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        />
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
        <Pagination.Last
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        />
      </Pagination>
    </div>
  )
}

export default InvoicesPagination