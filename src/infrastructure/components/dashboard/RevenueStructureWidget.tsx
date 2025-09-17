import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { RevenueStructureData } from '../../../domain/useCases';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RevenueStructureWidgetProps {
  data: RevenueStructureData;
}

export const RevenueStructureWidget: React.FC<RevenueStructureWidgetProps> = ({ data }) => {
  const clientData = {
    labels: data.byClient.slice(0, 5).map(c => c.name),
    datasets: [{
      data: data.byClient.slice(0, 5).map(c => c.revenue),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }],
  };

  const vatData = {
    labels: data.byVatRate.map(v => `TVA ${v.vatRate}%`),
    datasets: [{
      data: data.byVatRate.map(v => v.revenue),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }],
  };

  return (
    <div className="card mh-100 overflow-auto">
      <div className="card-body">
        <h5 className="card-title">Structure du Chiffre d'Affaires</h5>
        <div className="row">
          <div className="col-md-6">
            <h6>Par Client (Top 5)</h6>
            <Pie data={clientData} />
          </div>
          <div className="col-md-6">
            <h6>Par Taux de TVA</h6>
            <Pie data={vatData} />
          </div>
        </div>
      </div>
    </div>
  );
};