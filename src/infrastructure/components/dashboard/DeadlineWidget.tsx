import React from 'react';
import { Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useDeadlineChartData } from '../hooks/useDeadlineChartData'
import { useDashboardSearchParams, useDeadlineCompliance } from '../../../adapters/controllers'
import { BaseChartWidget } from './BaseChartWidget'
import { createChartOptions, CHART_CONSTANTS } from '../../shared/chartConfigFactory'
import { formatChartValue, formatCurrency } from '../../shared/chartUtils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const COUNT_DAYS_RANGE = [7, 15, 30]

export const DeadlineWidget: React.FC = React.memo(() => {
  const { deadlineComplianceDays, setDeadlineComplianceDays } = useDashboardSearchParams()
  const { data, loading, error } = useDeadlineCompliance()
  const selectedDays = deadlineComplianceDays
  const chartData = useDeadlineChartData(data || { dueSoon: [], overdue: [] }, selectedDays)

  const maxValue = chartData.datasets?.[0]?.data ?
    Math.max(...chartData.datasets[0].data.map((point: { x: number; y: number }) => point.y)) : 0

  if (loading) return <div className="text-center mt-3">Chargement des échéances...</div>;
  if (error) return <div className="alert alert-danger">Erreur: {error}</div>;
  if (!data) return <div className="text-center mt-3">Aucune donnée d'échéance</div>;

  const handleDaysChange = setDeadlineComplianceDays

  const options = createChartOptions('scatter', maxValue, {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const days = context.parsed.x
            const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' })
            const relative = rtf.format(days, 'day')
            return `${formatCurrency(context.parsed.y)}, ${relative}`
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Jours depuis aujourd'hui" },
        suggestedMin: -selectedDays,
        suggestedMax: selectedDays,
        ticks: {
          stepSize: 1,
          callback: (tickValue) => {
            if (typeof tickValue === 'number') {
              return `${tickValue} j`;
            }
            return tickValue;
          },
        },
      },
      y: {
        title: { display: true, text: 'Montant (€)' },
        beginAtZero: true,
        grid: { display: true },
        ticks: {
          callback: (tickValue) => {
            if (typeof tickValue === 'number') {
              return formatChartValue(tickValue, maxValue);
            }
            return tickValue;
          },
          font: { size: 14 },
        },
      },
    },
  })

  // Use standard chart dimensions
  const chartHeight = CHART_CONSTANTS.HEIGHT
  const chartWidth = CHART_CONSTANTS.WIDTH

  return (
    <BaseChartWidget title="Respect des Échéances">
      <div className="mb-3">
        <div className="btn-group" role="group">
          {COUNT_DAYS_RANGE.map((days) => (
            <button
              key={days}
              type="button"
              className={selectedDays === days ? 'btn btn-primary' : 'btn btn-outline-primary'}
              onClick={() => handleDaysChange(days)}
            >
              {days} jours
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <Scatter data={chartData} options={options} height={chartHeight} width={chartWidth} />
      </div>
    </BaseChartWidget>
  )
})
