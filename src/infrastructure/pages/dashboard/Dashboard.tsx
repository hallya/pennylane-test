import { useDashboard } from '../../../adapters/controllers';
import {
  CashFlowWidget,
  DeadlineWidget,
  ClientReliabilityWidget,
  RevenueStructureWidget,
} from '../../components';

const Dashboard: React.FC = () => {
  const { data, loading, error } = useDashboard();

  if (loading) return <div className="text-center mt-5">Chargement...</div>;
  if (error) return <div className="alert alert-danger">Erreur: {error}</div>;
  if (!data) return <div className="text-center mt-5">Aucune donnée</div>;

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4">Dashboard Financier</h1>
      <div className="row g-3">
        <div className="col-lg-6">
          <CashFlowWidget data={data.cashFlow} />
        </div>
        <div className="col-lg-6">
          <DeadlineWidget />
        </div>
        <div className="col-lg-6">
          <ClientReliabilityWidget data={data.clientReliability} />
        </div>
        <div className="col-lg-6">
          <RevenueStructureWidget data={data.revenueStructure} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;