import { useParams } from 'react-router-dom'
import { Form, Container, Row, Col, Card } from 'react-bootstrap'
import { useInvoiceForm } from '../../components/hooks/useInvoiceForm'
import { InvoiceFormFields, CustomerSelector, ProductLinesSelector } from '../../components/invoices'

const EditInvoiceRHF: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const invoiceId = id ? parseInt(id, 10) : undefined

  const {
    customers,
    form,
    invoiceLines,
    products,
    productSearchQuery,
    updateProductQuery,
    selectedCustomer,
    selectedProduct,
    showSuggestions,
    showProducts,
    setShowProducts,
    validationMode,
    handleAddProductToInvoice,
    handleCustomerSearchChange,
    handleCustomerSelect,
    handleFinalize,
    handleRemoveLine,
    handleSave,
    searchProducts,
    setSelectedProduct,
  } = useInvoiceForm('edit', invoiceId)

  return (
    <main className="container-fluid mt-4" role="main">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Header>
                <h1 className="mb-0">Modifier la Facture #{invoiceId}</h1>
              </Card.Header>
              <Card.Body>
                <Form noValidate>
                  <CustomerSelector
                    form={form}
                    customers={customers}
                    selectedCustomer={selectedCustomer}
                    showSuggestions={showSuggestions}
                    handleCustomerSearchChange={handleCustomerSearchChange}
                    handleCustomerSelect={handleCustomerSelect}
                    validationMode={validationMode}
                  />

                  <InvoiceFormFields
                    form={form}
                    validationMode={validationMode}
                  />

                  <ProductLinesSelector
                    form={form}
                    products={products}
                    productSearchQuery={productSearchQuery}
                    updateProductQuery={updateProductQuery}
                    searchProducts={searchProducts}
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    showProducts={showProducts}
                    setShowProducts={setShowProducts}
                    invoiceLines={invoiceLines}
                    handleAddProductToInvoice={handleAddProductToInvoice}
                    handleRemoveLine={handleRemoveLine}
                    validationMode={validationMode}
                  />

                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => window.history.back()}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleSave}
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleFinalize}
                    >
                      Finaliser
                    </button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default EditInvoiceRHF