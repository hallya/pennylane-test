import React from 'react'

const DashboardEmpty: React.FC = () => {
  return (
    <main className="container-fluid mt-4" role="main">
      <div
        className="text-center mt-5"
        role="status"
        aria-live="polite"
        aria-label="Aucune donnée disponible"
      >
        <div aria-hidden="true">Aucune donnée</div>
        <span className="sr-only">Aucune donnée disponible pour le dashboard financier</span>
      </div>
    </main>
  )
}

export default DashboardEmpty