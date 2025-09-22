import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useInvoices } from '../../../adapters/controllers'
import { InvoicesTable, InvoicesPagination } from '../../components'

const Invoices: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, loading, error, pagination } = useInvoices({
    page: currentPage,
    perPage: 50,
  })

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
        className="sr-only sr-only-focusable"
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
          <h1 className="mb-3" id="invoices-title">
            Factures
          </h1>
          <Link to="/invoices/create">
            <Button variant="primary">Créer une Facture</Button>
          </Link>
        </header>

        <InvoicesTable data={data} />

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
