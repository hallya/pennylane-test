import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CashFlowData } from '../../../domain/useCases';
import { BaseChartWidget } from './BaseChartWidget';
import { createChartOptions, CHART_CONSTANTS } from '../../shared/chartConfigFactory';
import { CHART_COLOR_PALETTE, formatChartValue, formatCurrency } from '../../shared/chartUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CashFlowWidgetProps {
  data: CashFlowData;
}

export const CashFlowWidget: React.FC<CashFlowWidgetProps> = React.memo(({ data }) => {
  const values = [data.totalIssued, data.totalReceived, data.outstandingReceivables];
  const maxValue = Math.max(...values);

  const chartData = {
    labels: ['Émis', 'Reçus', 'Encours'],
    datasets: [
      {
        data: values,
        backgroundColor: CHART_COLOR_PALETTE.slice(0, 3),
        borderColor: CHART_COLOR_PALETTE.slice(0, 3),
        borderWidth: CHART_CONSTANTS.BORDER_WIDTH,
      },
    ],
  };

  const options = createChartOptions('horizontalBar', maxValue);

  return (
    <BaseChartWidget title="Flux de Trésorerie">
      <div className="flex-grow-1 mb-3">
        <Bar data={chartData} options={options} />
      </div>
      {data.isAtRisk && (
        <div className="alert alert-danger mb-2">
          ⚠️ Trésorerie en danger : Encours élevé ou DSO {'>'} 30 jours
        </div>
      )}
      <p className="mb-0 small">DSO: {data.dso.toFixed(2)} jours</p>
    </BaseChartWidget>
  );
});