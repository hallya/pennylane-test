import React from 'react'

const InvoicesTableHeader: React.FC = React.memo(() => {
  return (
    <thead className="table-dark sticky-header">
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
  )
})

export default InvoicesTableHeader