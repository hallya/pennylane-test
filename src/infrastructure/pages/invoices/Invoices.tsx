import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const Invoices: React.FC = () => {
  return (
    <main className="container-fluid mt-4" role="main">
      <header className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Factures</h1>
        <Link to="/invoices/create">
          <Button variant="primary">Créer une Facture</Button>
        </Link>
      </header>
      <p>Voici la liste de toutes les factures.</p>
      {/* TODO: Add invoice list component */}
    </main>
  )
}

export default Invoices
