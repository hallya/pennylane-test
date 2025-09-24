import { useState } from 'react'
import { Form, Row, Col, Card, Dropdown, Button } from 'react-bootstrap'
import { Controller, UseFormReturn } from 'react-hook-form'
import { InvoiceFormData, ValidationMode } from '../../pages/invoices/types'
import { formatCurrency } from '../../shared/chartUtils'
import { DomainProduct } from '../../../domain/types'

interface ProductLinesSelectorProps {
  form: UseFormReturn<InvoiceFormData>
  products: DomainProduct[]
  productSearchQuery: string
  updateProductQuery: (query: string) => void
  searchProducts: (query: string) => void
  selectedProduct: DomainProduct | null
  setSelectedProduct: (product: DomainProduct | null) => void
  showProducts: boolean
  setShowProducts: (show: boolean) => void
  invoiceLines: InvoiceFormData['invoiceLines']
  handleAddProductToInvoice: (
    product: DomainProduct,
    quantity: number
  ) => void
  handleRemoveLine: (productId: number) => void
  validationMode: ValidationMode | null
}

export function ProductLinesSelector({
  form,
  invoiceLines,
  products,
  productSearchQuery,
  selectedProduct,
  showProducts,
  validationMode,
  handleAddProductToInvoice,
  handleRemoveLine,
  searchProducts,
  setSelectedProduct,
  setShowProducts,
  updateProductQuery,
}: ProductLinesSelectorProps) {
  const [quantity, setQuantity] = useState(1)

  return (
    <Card className="mt-0">
      <Card.Header>
        <Form.Label className="mb-0" htmlFor="invoiceLines">
          Lignes de Produits
        </Form.Label>
      </Card.Header>
      <Card.Body>
        <Controller
          name="invoiceLines"
          control={form.control}
          rules={{
            required:
              validationMode === 'finalize'
                ? 'Au moins un produit est requis pour finaliser la facture'
                : false,
            validate: (value) => {
              if (value.size === 0) {
                return 'Ajoutez au moins un produit à la facture'
              }
              return true
            },
          }}
          render={({ fieldState }) => (
            <Row className="mb-3">
              <Col md={6}>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Rechercher un produit..."
                    autoComplete="off"
                    required={validationMode === 'finalize'}
                    isInvalid={!!form.formState.errors.invoiceLines}
                    value={productSearchQuery}
                    onChange={(e) => searchProducts(e.target.value)}
                    onFocus={() => {
                      if (selectedProduct) {
                        updateProductQuery('')
                        setSelectedProduct(null)
                        setShowProducts(false)
                      }
                    }}
                  />
                  <Dropdown.Menu show={showProducts} className="mt-1">
                    {products.map((product) => (
                      <Dropdown.Item
                        key={product.id}
                        active={selectedProduct?.id === product.id}
                        onClick={() => {
                          setSelectedProduct(product)
                          updateProductQuery(product.label)
                          setShowProducts(false)
                        }}
                      >
                        <div className="d-flex gap-4 justify-content-between align-items-center">
                          <span>{product.label}</span>
                          <small className="text-muted">
                            {product.unit_price}€ (TVA: {product.vat_rate}%)
                          </small>
                        </div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                  <Form.Control.Feedback type="invalid">
                    {fieldState.error?.message}
                  </Form.Control.Feedback>
                </div>
              </Col>
              <Col md={2}>
                <Form.Control
                  name="quantity"
                  type="number"
                  placeholder="Quantité"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </Col>
              <Col md={3}>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    if (selectedProduct) {
                      handleAddProductToInvoice(selectedProduct, quantity)
                      setSelectedProduct(null)
                      updateProductQuery('')
                      setQuantity(1)
                    }
                  }}
                  disabled={!selectedProduct}
                >
                  Ajouter
                </Button>
              </Col>
            </Row>
          )}
        />

        {invoiceLines.size > 0 && (
          <div className="mt-3">
            {Array.from(invoiceLines.values()).map((line) => (
              <div
                key={line.product_id}
                className="d-flex justify-content-between align-items-center border-bottom py-2"
              >
                <div>
                  <strong>{line.label}</strong>
                  <br />
                  <small className="text-muted">
                    Quantité: {line.quantity} - Prix TTC:{' '}
                    {formatCurrency(Number(line.price))} - TVA: {line.vat_rate}%
                  </small>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemoveLine(line.product_id)}
                >
                  Supprimer
                </button>
              </div>
            ))}

            {(() => {
              const lines = Array.from(invoiceLines.values())
              const totalQuantity = lines.reduce(
                (sum, line) => sum + (line.quantity || 0),
                0
              )
              const totalTax = lines.reduce(
                (sum, line) => sum + Number(line.tax || 0),
                0
              )
              const totalAmount = lines.reduce(
                (sum, line) => sum + Number(line.price) * (line.quantity || 0),
                0
              )

              return (
                <div className="pt-3 mt-0">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Quantité totale:</span>
                    <span>{totalQuantity}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Taxe totale:</span>
                    <span>{formatCurrency(totalTax)}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>Total TTC:</strong>
                    <strong>{formatCurrency(totalAmount)}</strong>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}
