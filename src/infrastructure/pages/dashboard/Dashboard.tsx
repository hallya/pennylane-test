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
      <div
        className="dashboard-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
          gap: '1rem',
        }}
      >
        <CashFlowWidget data={data.cashFlow} />
        <DeadlineWidget />
        <ClientReliabilityWidget data={data.clientReliability} />
        <RevenueStructureWidget data={data.revenueStructure} />
      </div>
    </div>
  );
};

export default Dashboard;