import { memo } from 'react'

const InvoicesTableHeaderComponent: React.FC = () => {
  return (
    <thead className="table-dark sticky-header">
      <tr>
        <th scope="col">Statut</th>
        <th scope="col">Prénom et nom du client</th>
        <th scope="col">Date d&apos;émission</th>
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
  )
}

InvoicesTableHeaderComponent.displayName = 'InvoicesTableHeader'

const InvoicesTableHeader = memo(InvoicesTableHeaderComponent)

export default InvoicesTableHeader