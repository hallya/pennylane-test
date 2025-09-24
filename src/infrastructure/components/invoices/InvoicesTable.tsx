import { InvoiceEntity } from '../../../domain/entities'
import {
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_BOOTSTRAP_CLASSES,
  OVERDUE_BOOTSTRAP_CLASS,
  DUE_SOON_BOOTSTRAP_CLASS,
} from '../../../domain/constants'
import { formatCurrency } from '../../shared/chartUtils'
import InvoicesTableHeader from './InvoicesTableHeader'
import { memo } from 'react'

export interface InvoicesTableProps {
  data: InvoiceEntity[]
  onDelete: (id: number) => void | Promise<void>
  onEdit: (id: number) => void
  onView: (id: number) => void
  onCustomerClick?: (customerId: number) => void
}

const InvoicesTableComponent: React.FC<InvoicesTableProps> = ({ data, onDelete, onEdit, onView, onCustomerClick }) => {
    const formatDate = (dateString: string | null) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('fr-FR')
    }

    const handleDelete = async (id: number) => {
      if (
        window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')
      ) {
        if (onDelete) {
          await onDelete(id)
        }
      }
    }

    return (
      <div
        className="table-responsive invoices-table-container"
        data-testid="invoices-table-wrapper"
        style={{
          maxHeight: '75vh',
          overflowY: 'auto',
        }}
      >
        <table className="table table-striped table-hover table-bordered">
          <InvoicesTableHeader />
          <tbody className="position-relative z-1">
            {data.map((invoice) => {
              const status = invoice.getStatus()
              const statusLabel = INVOICE_STATUS_LABELS[status]
              const statusClass =
                status !== 'draft'
                  ? INVOICE_STATUS_BOOTSTRAP_CLASSES[status]
                  : ''

              return (
                <tr key={invoice.id}>
                  <td className={statusClass ? `${statusClass} fw-bold` : ''}>
                    {statusLabel}
                  </td>
                  <td>
                    {invoice.customer ? (
                      <span
                        className={
                          onCustomerClick ? 'clickable-customer-name' : ''
                        }
                        style={{
                          cursor: onCustomerClick ? 'pointer' : 'default',
                          color: onCustomerClick ? '#007bff' : 'inherit',
                          textDecoration: onCustomerClick
                            ? 'underline'
                            : 'none',
                        }}
                        onClick={() =>
                          onCustomerClick &&
                          onCustomerClick(invoice.customer!.id)
                        }
                        title={
                          onCustomerClick
                            ? 'Cliquer pour filtrer par ce client'
                            : undefined
                        }
                      >
                        {invoice.customer.first_name}{' '}
                        {invoice.customer.last_name}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{formatDate(invoice.date)}</td>
                  <td
                    className={
                      invoice.finalized
                        ? invoice.isOverdue()
                          ? OVERDUE_BOOTSTRAP_CLASS
                          : invoice.isDueSoon()
                          ? DUE_SOON_BOOTSTRAP_CLASS
                          : ''
                        : ''
                    }
                  >
                    {formatDate(invoice.deadline)}
                  </td>
                  <td className="text-end">
                    {formatCurrency(invoice.getSubtotalAmount())}
                  </td>
                  <td className="text-end">
                    {formatCurrency(invoice.getTotalTaxAmount())}
                  </td>
                  <td className="text-end">
                    {formatCurrency(invoice.getTotalAmount())}
                  </td>
                  <td className="text-end">
                    {invoice.paid
                      ? formatCurrency(invoice.getTotalAmount())
                      : '-'}
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span>#{invoice.id}</span>
                      <button
                        className="btn btn-sm btn-outline-info ms-2"
                        onClick={() => onView(invoice.id)}
                        title="Voir la facture"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      {!invoice.finalized && (
                        <button
                          className="btn btn-sm btn-outline-primary ms-2"
                          onClick={() => onEdit(invoice.id)}
                          title="Modifier la facture"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      )}
                      {!invoice.finalized && (
                        <button
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={() => handleDelete(invoice.id)}
                          title="Supprimer la facture"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
}

InvoicesTableComponent.displayName = 'InvoicesTable'

const InvoicesTable = memo(InvoicesTableComponent)

export default InvoicesTable
