import { Form, Col, Row, Dropdown } from 'react-bootstrap'
import { Controller, UseFormReturn } from 'react-hook-form'
import { InvoiceFormData, ValidationMode } from '../../pages/invoices/types'
import { DomainCustomer } from '../../../domain/types'

interface CustomerSelectorProps {
  form: UseFormReturn<InvoiceFormData>
  customers: DomainCustomer[]
  selectedCustomer: DomainCustomer | null
  showSuggestions: boolean
  handleCustomerSearchChange: (value: string) => void
  handleCustomerSelect: (customer: DomainCustomer) => void
  validationMode: ValidationMode | null
}

export function CustomerSelector({
  form,
  customers,
  selectedCustomer,
  showSuggestions,
  handleCustomerSearchChange,
  handleCustomerSelect,
  validationMode,
}: CustomerSelectorProps) {
  return (
    <Row>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="customerName">
            Client{validationMode === 'finalize' ? ' *' : ''}
          </Form.Label>
          <Controller
            name="customerName"
            control={form.control}
            rules={{
              required:
                validationMode === 'finalize'
                  ? 'Le client est requis pour finaliser la facture'
                  : false,
              validate: () => {
                if (!selectedCustomer) {
                  return 'Veuillez sélectionner un client dans la liste des suggestions'
                }
                return true
              },
            }}
            render={({ field, fieldState }) => (
              <div className="position-relative">
                <Form.Control
                  {...field}
                  value={field.value ?? ''}
                  id="customerName"
                  type="text"
                  placeholder="Tapez le nom du client..."
                  autoComplete="off"
                  isInvalid={!!form.formState.errors.customerName}
                  isValid={
                    selectedCustomer !== null &&
                    !form.formState.errors.customerName
                  }
                  onChange={(e) => {
                    field.onChange(e)
                    handleCustomerSearchChange(e.target.value)
                    if (form.formState.errors.customerName) {
                      form.clearErrors('customerName')
                    }
                  }}
                />
                <Dropdown.Menu show={showSuggestions} className="mt-2">
                  {customers.map((customer) => (
                    <Dropdown.Item
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                    >
                      {customer.first_name} {customer.last_name}
                      <br />
                      <small className="text-muted">
                        {customer.address}, {customer.city}
                      </small>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>

                <Form.Control.Feedback type="invalid">
                  {fieldState.error?.message}
                </Form.Control.Feedback>
              </div>
            )}
          />
        </Form.Group>
      </Col>
    </Row>
  )
}
