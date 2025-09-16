import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CashFlowData } from '../../../domain/useCases';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CashFlowWidgetProps {
  data: CashFlowData;
}

export const CashFlowWidget: React.FC<CashFlowWidgetProps> = ({ data }) => {
  const chartData = {
    labels: ['Total Issued', 'Total Received', 'Outstanding'],
    datasets: [
      {
        label: 'Amount (€)',
        data: [data.totalIssued, data.totalReceived, data.outstandingReceivables],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Cash Flow Overview' },
    },
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Flux de Trésorerie</h5>
        <Bar data={chartData} options={options} />
        {data.isAtRisk && (
          <div className="alert alert-danger mt-3">
            ⚠️ Trésorerie en danger : Encours élevé ou DSO {'>'} 30 jours
          </div>
        )}
        <p>DSO: {data.dso.toFixed(2)} jours</p>
      </div>
    </div>
  );
};