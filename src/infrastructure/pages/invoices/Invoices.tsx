import React, { useState, useCallback, memo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useInvoices, useDeleteInvoice } from '../../../adapters/controllers'
import { InvoicesTable, InvoicesPagination } from '../../components'
import FilterBadge from '../../components/invoices/FilterBadge'

const InvoicesFilterComponent: React.FC<{
  customerId?: number
  onRemoveFilter: () => void
}> = ({ customerId, onRemoveFilter }) => {
  const { data } = useInvoices({
    page: 1,
    perPage: 1,
    customerId,
  })

  if (!customerId || !data || data.length === 0 || !data[0].customer) {
    return null
  }

  return (
    <FilterBadge
      customerName={`${data[0].customer!.first_name} ${
        data[0].customer!.last_name
      }`}
      onRemove={onRemoveFilter}
    />
  )
}

InvoicesFilterComponent.displayName = 'InvoicesFilter'

const InvoicesFilter = memo(InvoicesFilterComponent)

const Invoices: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)

  const customerId = searchParams.get('customerId')
    ? parseInt(searchParams.get('customerId')!)
    : undefined

  const { data, loading, error, pagination, refetch } = useInvoices({
    page: currentPage,
    perPage: 50,
    customerId,
  })
  const { deleteInvoice } = useDeleteInvoice()

  const handleEdit = useCallback(
    (id: number) => {
      navigate(`/invoices/edit/${id}`)
    },
    [navigate]
  )

  const handleView = useCallback(
    (id: number) => {
      navigate(`/invoices/view/${id}`)
    },
    [navigate]
  )

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteInvoice(id)
        refetch()
      } catch {
        // Error handling is done by the mutation hook
      }
    },
    [deleteInvoice, refetch]
  )

  const handleCustomerClick = useCallback(
    (clickedCustomerId: number) => {
      setSearchParams({ customerId: clickedCustomerId.toString() })
      setCurrentPage(1)
    },
    [setSearchParams]
  )

  const handleRemoveFilter = () => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete('customerId')
    setSearchParams(newSearchParams)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <main className="container-fluid mt-4" role="main">
        <header>
          <h1 className="mb-3">Factures</h1>
        </header>
        <p>Chargement des factures...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container-fluid mt-4" role="main">
        <header>
          <h1 className="mb-3">Factures</h1>
        </header>
        <p>Erreur lors du chargement des factures: {error}</p>
      </main>
    )
  }

  if (!data || data.length === 0) {
    return (
      <main className="container-fluid mt-4" role="main">
        <header>
          <h1 className="mb-3">Factures</h1>
        </header>
        <p>Aucune facture trouvée.</p>
      </main>
    )
  }

  return (
    <>
      <a
        href="#invoices-title"
        className="sr-only sr-only-focusable skip-link"
        style={{
          position: 'absolute',
          top: '-50px',
          left: '6px',
          background: '#000',
          color: '#fff',
          padding: '8px',
          textDecoration: 'none',
          zIndex: 1000,
        }}
      >
        Aller au contenu principal
      </a>

      <main className="container-fluid mt-4" role="main">
        <header className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <h1 className="mb-3 me-3" id="invoices-title">
              Factures
            </h1>
            <InvoicesFilter
              customerId={customerId}
              onRemoveFilter={handleRemoveFilter}
            />
          </div>
          <Link to="/invoices/create">
            <Button variant="primary">Créer une Facture</Button>
          </Link>
        </header>

        <InvoicesTable
          data={data}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={handleView}
          onCustomerClick={handleCustomerClick}
        />

        <InvoicesPagination
          currentPage={currentPage}
          totalPages={pagination?.total_pages || 1}
          onPageChange={setCurrentPage}
        />
      </main>
    </>
  )
}

export default Invoices
