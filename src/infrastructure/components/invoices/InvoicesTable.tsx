import React from 'react'
import { InvoiceEntity } from '../../../domain/entities'
import {
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_BOOTSTRAP_CLASSES,
  OVERDUE_BOOTSTRAP_CLASS,
  DUE_SOON_BOOTSTRAP_CLASS,
} from '../../../domain/constants'
import { formatCurrency } from '../../shared/chartUtils'

interface InvoicesTableProps {
  data: InvoiceEntity[]
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({ data }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  return (
    <div
      className="table-responsive"
      data-testid="invoices-table-wrapper"
      style={{
        maxHeight: '75vh',
        overflowY: 'auto',
      }}
    >
      <table className="table table-striped table-hover table-bordered">
        <thead
          className="table-dark"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 2,
          }}
        >
          <tr>
            <th scope="col">Statut</th>
            <th scope="col">Prénom et nom du customer</th>
            <th scope="col">Date d'émission</th>
            <th scope="col">Échéance</th>
            <th scope="col" className="text-end">
              Total HT
            </th>
            <th scope="col" className="text-end">
              Total TVA
            </th>
            <th scope="col" className="text-end">
              Total TTC
            </th>
            <th scope="col" className="text-end">
              Total perçu
            </th>
            <th scope="col">ID</th>
          </tr>
        </thead>
        <tbody className="position-relative z-1">
          {data.map((invoice) => {
            const status = invoice.getStatus()
            const statusLabel = INVOICE_STATUS_LABELS[status]
            const statusClass =
              status !== 'draft' ? INVOICE_STATUS_BOOTSTRAP_CLASSES[status] : ''

            return (
              <tr key={invoice.id}>
                <td className={statusClass ? `${statusClass} fw-bold` : ''}>
                  {statusLabel}
                </td>
                <td>
                  {invoice.customer
                    ? `${invoice.customer.first_name} ${invoice.customer.last_name}`
                    : '-'}
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
                <td>#{invoice.id}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default InvoicesTable
