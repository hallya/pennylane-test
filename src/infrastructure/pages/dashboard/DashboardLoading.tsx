import React from 'react'

const DashboardLoading: React.FC = () => {
  return (
    <main className="container-fluid mt-4" role="main">
      <div
        className="text-center mt-5"
        role="status"
        aria-live="polite"
        aria-label="Chargement du dashboard"
      >
        <div aria-hidden="true">Chargement...</div>
        <span className="sr-only">Chargement des données du dashboard financier en cours</span>
      </div>
    </main>
  )
}

export default DashboardLoading