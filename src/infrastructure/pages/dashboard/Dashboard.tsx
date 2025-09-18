import { useDashboard } from '../../../adapters/controllers'
import {
  CashFlowWidget,
  DeadlineWidget,
  ClientReliabilityWidget,
  RevenueStructureWidget,
} from '../../components'

const Dashboard: React.FC = () => {
  const { data, loading, error } = useDashboard()

  if (loading) return <div className="text-center mt-5">Chargement...</div>
  if (error) return <div className="alert alert-danger">Erreur: {error}</div>
  if (!data) return <div className="text-center mt-5">Aucune donnée</div>

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-3">Dashboard Financier</h1>
      <div className="row g-2">
        <div className="col-12 col-lg-6">
          <div className="d-flex flex-column h-100 gap-3">
            <div className="flex-grow-0">
              <CashFlowWidget data={data.cashFlow} />
            </div>
            <div className="flex-grow-1">
              <ClientReliabilityWidget data={data.clientReliability} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="d-flex flex-column h-100 gap-3">
            <div className="flex-grow-1">
              <DeadlineWidget data={data.deadlineCompliance} />
            </div>
            <div className="flex-grow-0">
              <RevenueStructureWidget data={data.revenueStructure} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
