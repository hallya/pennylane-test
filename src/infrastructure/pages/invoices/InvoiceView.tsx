import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Table,
} from 'react-bootstrap'
import { useGetInvoice } from '../../../adapters/controllers/invoices/useGetInvoice'
import { formatCurrency } from '../../shared/chartUtils'

const InvoiceView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const invoiceId = id ? parseInt(id, 10) : undefined

  const { data: invoice, loading, error } = useGetInvoice(invoiceId || null)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  if (loading) {
    return (
      <main className="container-fluid mt-4" role="main">
        <Container>
          <div className="text-center">
            <p>Chargement de la facture...</p>
          </div>
        </Container>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container-fluid mt-4" role="main">
        <Container>
          <div className="text-center">
            <p className="text-danger">
              Erreur lors du chargement de la facture: {error}
            </p>
            <Button variant="secondary" onClick={() => navigate('/invoices')}>
              Retour aux factures
            </Button>
          </div>
        </Container>
      </main>
    )
  }

  if (!invoice) {
    return (
      <main className="container-fluid mt-4" role="main">
        <Container>
          <div className="text-center">
            <p>Facture non trouvée.</p>
            <Button variant="secondary" onClick={() => navigate('/invoices')}>
              Retour aux factures
            </Button>
          </div>
        </Container>
      </main>
    )
  }

  const status = invoice.getStatus()

  return (
    <main className="container-fluid mt-4" role="main">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h1 className="mb-0">Facture #{invoice.id}</h1>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/invoices')}
                  >
                    Retour aux factures
                  </Button>
                  {!invoice.paid && (
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
                    >
                      Modifier
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                <Row className="mb-4">
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Header>
                        <h2 className="mb-0">Informations Client</h2>
                      </Card.Header>
                      <Card.Body>
                        {invoice.customer ? (
                          <>
                            <p className="mb-2">
                              <strong>Nom:</strong>{' '}
                              {invoice.customer.first_name}{' '}
                              {invoice.customer.last_name}
                            </p>
                            <p className="mb-0">
                              <strong>Client ID:</strong> #{invoice.customer.id}
                            </p>
                          </>
                        ) : (
                          <p className="text-muted">Aucun client associé</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Header>
                        <h2 className="mb-0">Informations Facture</h2>
                      </Card.Header>
                      <Card.Body>
                        <p className="mb-2">
                          <strong>Date d'émission:</strong>{' '}
                          {formatDate(invoice.date)}
                        </p>
                        <p className="mb-2">
                          <strong>Date d'échéance:</strong>{' '}
                          {formatDate(invoice.deadline)}
                        </p>
                        <p className="mb-2">
                          <strong>Statut de paiement:</strong>{' '}
                          <Badge bg={invoice.paid ? 'success' : 'warning'}>
                            {invoice.paid ? 'Payée' : 'Non payée'}
                          </Badge>
                        </p>
                        <p className="mb-0">
                          <strong>Statut de finalisation:</strong>{' '}
                          <Badge
                            bg={invoice.finalized ? 'success' : 'secondary'}
                          >
                            {invoice.finalized ? 'Finalisée' : 'Brouillon'}
                          </Badge>
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col>
                    <Card>
                      <Card.Header>
                        <h2 className="mb-0">Lignes de Facture</h2>
                      </Card.Header>
                      <Card.Body className="p-0">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Produit</th>
                              <th>Quantité</th>
                              <th>Unité</th>
                              <th>Prix unitaire</th>
                              <th>TVA</th>
                              <th>Total HT</th>
                              <th>Total TTC</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoice.invoice_lines.map((line) => (
                              <tr key={line.id}>
                                <td>{line.label}</td>
                                <td>{line.quantity}</td>
                                <td>{line.unit}</td>
                                <td className="text-end">
                                  {formatCurrency(parseFloat(line.price))}
                                </td>
                                <td className="text-end">
                                  {formatCurrency(parseFloat(line.tax))}
                                </td>
                                <td className="text-end">
                                  {formatCurrency(
                                    (parseFloat(line.price) -
                                      parseFloat(line.tax)) *
                                      line.quantity
                                  )}
                                </td>
                                <td className="text-end">
                                  {formatCurrency(
                                    parseFloat(line.price) * line.quantity
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col md={{ span: 6, offset: 6 }}>
                    <Card>
                      <Card.Body>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Total HT:</span>
                          <strong>
                            {formatCurrency(invoice.getSubtotalAmount())}
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Total TVA:</span>
                          <strong>
                            {formatCurrency(invoice.getTotalTaxAmount())}
                          </strong>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <span>
                            <strong>Total TTC:</strong>
                          </span>
                          <strong>
                            {formatCurrency(invoice.getTotalAmount())}
                          </strong>
                        </div>
                        {invoice.paid && (
                          <>
                            <hr />
                            <div className="d-flex justify-content-between text-success">
                              <span>
                                <strong>Total perçu:</strong>
                              </span>
                              <strong>
                                {formatCurrency(invoice.getTotalAmount())}
                              </strong>
                            </div>
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default InvoiceView
