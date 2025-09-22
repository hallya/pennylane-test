import { Form, Row, Col } from 'react-bootstrap'
import { Controller, UseFormReturn } from 'react-hook-form'
import { InvoiceFormData, ValidationMode } from '../../pages/invoices/types'

interface InvoiceFormFieldsProps {
  form: UseFormReturn<InvoiceFormData>
  validationMode: ValidationMode | null
}

export function InvoiceFormFields({
  form,
  validationMode,
}: InvoiceFormFieldsProps) {
  return (
    <Row>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="date">Date</Form.Label>
          <Controller
            name="date"
            control={form.control}
            rules={{
              required: validationMode === 'finalize' ? 'La date de facture est requise pour finaliser la facture' : false,
            }}
            render={({ field }) => (
              <Form.Control
                {...field}
                id="date"
                type="date"
                required={validationMode === 'finalize'}
                isValid={!!field.value && !form.formState.errors.date}
                isInvalid={!!form.formState.errors.date}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {form.formState.errors.date?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="deadline">Échéance {validationMode === 'finalize' && '*'}</Form.Label>
          <Controller
            name="deadline"
            control={form.control}
            rules={{
              required: validationMode === 'finalize' ? "La date d'échéance est requise pour finaliser la facture" : false,
              validate: (value) => {
                if (!value) return true
                const invoiceDate = form.watch('date')
                if (invoiceDate && new Date(value) <= new Date(invoiceDate)) {
                  return "La date d'échéance doit être postérieure à la date de facture"
                }
                return true
              },
            }}
            render={({ field }) => (
              <Form.Control
                {...field}
                id="deadline"
                type="date"
                required={validationMode === 'finalize'}
                isValid={!!field.value && !form.formState.errors.deadline}
                isInvalid={!!form.formState.errors.deadline}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {form.formState.errors.deadline?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Statut de paiement {validationMode === 'finalize' && '*'}</Form.Label>
          <Controller
            name="paid"
            control={form.control}
            rules={{
              validate: (value) => {
                if (validationMode === 'finalize' && value === undefined) {
                  return 'Le statut de paiement est requis pour finaliser la facture'
                }
                return true
              },
            }}
            render={({ field: { onChange, value, ...field } }) => (
              <Form.Check
                {...field}
                type="checkbox"
                checked={value || false}
                onChange={(e) => onChange(e.target.checked)}
                label="Facture payée"
                isInvalid={!!form.formState.errors.paid}
                required={validationMode === 'finalize'}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {form.formState.errors.paid?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </Row>
  )
}
