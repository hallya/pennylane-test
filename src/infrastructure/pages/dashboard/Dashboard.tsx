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
      <h1 className="mb-4">Dashboard Financier</h1>
      <div className="row g-2">
        <div className="col-12 col-lg-5">
          <div className="row g-2">
            <div className="col-12">
              <CashFlowWidget data={data.cashFlow} />
            </div>
            <div className="col-12">
              <RevenueStructureWidget data={data.revenueStructure} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="row g-2">
            <div className="col-12">
              <DeadlineWidget data={data.deadlineCompliance} />
            </div>
            <div className="col-12">
              <ClientReliabilityWidget data={data.clientReliability} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
