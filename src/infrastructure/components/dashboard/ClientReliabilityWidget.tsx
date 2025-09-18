import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ClientReliabilityData } from '../../../domain/useCases';
import { BaseChartWidget } from './BaseChartWidget';
import {
  ChartOptionsBuilder,
  useChartData,
  CHART_CONSTANTS,
} from '../../shared/chartConfigFactory';
import { formatChartValue } from '../../shared/chartUtils';
import { CHART_COLOR_PALETTE } from '../../shared/chartUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ClientReliabilityWidgetProps {
  data: ClientReliabilityData;
}

export const ClientReliabilityWidget: React.FC<ClientReliabilityWidgetProps> = React.memo(({ data }) => {
  const [showAll, setShowAll] = useState(false);

  const latePayersSorted = data.latePayers.sort((a, b) => b.lateCount - a.lateCount);
  const largeOutstandingSorted = data.largeOutstanding.sort((a, b) => b.amount - a.amount);

  const latePayersData = showAll ? latePayersSorted : latePayersSorted.slice(0, 5);
  const largeOutstandingData = showAll ? largeOutstandingSorted : largeOutstandingSorted.slice(0, 5);

  const { values: lateValues } = useChartData(
    latePayersData,
    (client) => client.lateCount,
    (value) => value.toString()
  );
  const { values: outstandingValues } = useChartData(
    largeOutstandingData,
    (client) => client.amount,
    formatChartValue
  );

  const lateLabels = latePayersData.map((c) => c.name);
  const outstandingLabels = largeOutstandingData.map((c) => c.name);

  const lateData = {
    labels: lateLabels,
    datasets: [
      {
        data: lateValues,
        backgroundColor: CHART_COLOR_PALETTE.slice(0, latePayersData.length),
        borderColor: CHART_COLOR_PALETTE.slice(0, latePayersData.length),
        borderWidth: CHART_CONSTANTS.BORDER_WIDTH,
      },
    ],
  };

  const outstandingData = {
    labels: outstandingLabels,
    datasets: [
      {
        data: outstandingValues,
        backgroundColor: CHART_COLOR_PALETTE.slice(0, largeOutstandingData.length),
        borderColor: CHART_COLOR_PALETTE.slice(0, largeOutstandingData.length),
        borderWidth: CHART_CONSTANTS.BORDER_WIDTH,
      },
    ],
  };

  const lateOptions = new ChartOptionsBuilder()
    .forHorizontalBar()
    .responsive(false)
    .withLegend(false)
    .withPadding(0)
    .withXAxisStepSize(1)
    .withTooltipFormatter((context: any) => {
      const value = context.parsed.x;
      return `${context.label}: ${value} retards`;
    })
    .build();

  const outstandingOptions = new ChartOptionsBuilder()
    .forHorizontalBar()
    .responsive(false)
    .withLegend(false)
    .withPadding(0)
    .withCurrencyFormatting()
    .withTooltipFormatter((context: any) => {
      const value = context.parsed.x;
      return `${context.label}: ${value.toLocaleString('fr-FR')}€`;
    })
    .build();

  const totalLatePayers = data.latePayers.length;
  const totalLargeOutstanding = data.largeOutstanding.length;
  const totalOutstandingAmount = data.largeOutstanding.reduce((sum, client) => sum + client.amount, 0);

  const isAtRisk = totalLatePayers > 5 || totalOutstandingAmount > 50000; // Example thresholds

  return (
    <BaseChartWidget title="Fiabilité du Portefeuille Clients">
      <div>
        <div className="row text-center">
          <div className="col-4">
            <div className="fw-bold">{totalLatePayers}</div>
            <small className="text-muted">Clients en retard</small>
          </div>
          <div className="col-4">
            <div className="fw-bold">{totalLargeOutstanding}</div>
            <small className="text-muted">Gros encours</small>
          </div>
          <div className="col-4">
            <div className="fw-bold">{totalOutstandingAmount.toLocaleString('fr-FR')}€</div>
            <small className="text-muted">Total encours élevé</small>
          </div>
        </div>
      </div>
      {isAtRisk && (
        <div className="alert alert-danger mb-0 p-2">
          ⚠️ Portefeuille à risque : Nombre élevé de clients en retard ou encours important
        </div>
      )}
      <div>
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-sm ${!showAll ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowAll(false)}
          >
            Top 5
          </button>
          <button
            type="button"
            className={`btn btn-sm ${showAll ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowAll(true)}
          >
            Tous ({Math.max(data.latePayers.length, data.largeOutstanding.length)})
          </button>
        </div>
      </div>
      <div className="row flex-grow-1">
        <div className="col-md-6">
          <h6 className="mb-0">Clients avec gros encours</h6>
          <Bar data={outstandingData} options={outstandingOptions} />
        </div>
        <div className="col-md-6">
          <h6 className="mb-0">Clients payant en retard</h6>
          <Bar data={lateData} options={lateOptions} />
        </div>
      </div>
    </BaseChartWidget>
  );
});