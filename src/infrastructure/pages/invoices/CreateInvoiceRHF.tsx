import { useNavigate } from 'react-router-dom'
import { Form, Container, Row, Col, Card } from 'react-bootstrap'
import { useCreateInvoiceForm } from '../../components/hooks'
import { InvoiceFormFields, CustomerSelector, ProductLinesSelector } from '../../components/invoices'

const CreateInvoiceRHF: React.FC = () => {
  const navigate = useNavigate()
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
  } = useCreateInvoiceForm()

  return (
    <main className="container-fluid mt-4" role="main">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Header>
                <h1 className="mb-0">Créer une Nouvelle Facture</h1>
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
                      onClick={() => navigate('/invoices')}
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

export default CreateInvoiceRHF
