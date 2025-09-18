import { useDashboard } from '../../../adapters/controllers'
import {
  CashFlowWidget,
  DeadlineWidget,
  ClientReliabilityWidget,
  RevenueStructureWidget,
} from '../../components'
import { DashboardLoading, DashboardError, DashboardEmpty } from './index'

const Dashboard: React.FC = () => {
  const { data, loading, error } = useDashboard()

  if (loading) return <DashboardLoading />
  if (error) return <DashboardError error={error} />
  if (!data) return <DashboardEmpty />

  return (
    <>
      <a
        href="#dashboard-title"
        className="sr-only sr-only-focusable"
        style={{
          position: 'absolute',
          top: '-40px',
          left: '6px',
          background: '#000',
          color: '#fff',
          padding: '8px',
          textDecoration: 'none',
          zIndex: 1000,
        }}
      >
        Aller au contenu principal
      </a>
      <main className="container-fluid mt-4" role="main">
        <header>
          <h1 className="mb-3" id="dashboard-title">Dashboard Financier</h1>
        </header>

      <div
        className="row g-2"
        role="region"
        aria-labelledby="dashboard-title"
        aria-label="Tableau de bord avec indicateurs financiers"
      >
        <div className="col-12 col-lg-6">
          <section
            className="d-flex flex-column h-100 gap-3"
            aria-label="Section gauche du dashboard"
          >
            <div className="flex-grow-0" role="region" aria-label="Flux de trésorerie">
              <CashFlowWidget data={data.cashFlow} />
            </div>
            <div className="flex-grow-1" role="region" aria-label="Fiabilité client">
              <ClientReliabilityWidget data={data.clientReliability} />
            </div>
          </section>
        </div>

        <div className="col-12 col-lg-6">
          <section
            className="d-flex flex-column h-100 gap-3"
            aria-label="Section droite du dashboard"
          >
            <div className="flex-grow-1" role="region" aria-label="Échéances">
              <DeadlineWidget data={data.deadlineCompliance} />
            </div>
            <div className="flex-grow-0" role="region" aria-label="Structure des revenus">
              <RevenueStructureWidget data={data.revenueStructure} />
            </div>
          </section>
        </div>
      </div>
      </main>
    </>
  )
}

export default Dashboard
