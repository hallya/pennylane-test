import React from 'react'

interface DashboardErrorProps {
  error: string
}

const DashboardError: React.FC<DashboardErrorProps> = ({ error }) => {
  return (
    <main className="container-fluid mt-4" role="main">
      <div
        className="alert alert-danger"
        role="alert"
        aria-live="assertive"
        aria-label="Erreur de chargement"
      >
        <strong>Erreur:</strong> {error}
      </div>
    </main>
  )
}

export default DashboardError