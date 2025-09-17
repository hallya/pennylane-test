import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { RevenueStructureData } from '../../../domain/useCases';
import { BaseChartWidget } from './BaseChartWidget';
import { createChartOptions, CHART_CONSTANTS } from '../../shared/chartConfigFactory';
import { CHART_COLOR_PALETTE } from '../../shared/chartUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface RevenueStructureWidgetProps {
  data: RevenueStructureData;
}

export const RevenueStructureWidget: React.FC<RevenueStructureWidgetProps> = React.memo(({ data }) => {
  const clientValues = data.byClient.slice(0, 5).map(c => c.revenue);
  const vatValues = data.byVatRate.map(v => v.revenue);
  const clientMaxValue = Math.max(...clientValues);
  const vatMaxValue = Math.max(...vatValues);

  const clientData = {
    labels: data.byClient.slice(0, 5).map(c => c.name),
    datasets: [{
      data: clientValues,
      backgroundColor: CHART_COLOR_PALETTE.slice(0, 5),
      borderColor: CHART_COLOR_PALETTE.slice(0, 5),
      borderWidth: 1,
    }],
  };

  const vatData = {
    labels: data.byVatRate.map(v => `TVA ${v.vatRate}%`),
    datasets: [{
      data: vatValues,
      backgroundColor: CHART_COLOR_PALETTE.slice(0, data.byVatRate.length),
      borderColor: CHART_COLOR_PALETTE.slice(0, data.byVatRate.length),
      borderWidth: 1,
    }],
  };

  const clientOptions = createChartOptions('horizontalBar', clientMaxValue);
  const vatOptions = createChartOptions('horizontalBar', vatMaxValue);

  return (
    <BaseChartWidget title="Structure du Chiffre d'Affaires">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h6>Par Client (Top 5)</h6>
          <Bar data={clientData} options={clientOptions} />
        </div>
        <div className="col-md-6">
          <h6>Par Taux de TVA</h6>
          <Bar data={vatData} options={vatOptions} />
        </div>
      </div>
    </BaseChartWidget>
  );
});