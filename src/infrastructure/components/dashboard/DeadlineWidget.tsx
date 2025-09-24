import React from 'react'
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
import { useDashboardSearchParams } from '../../../adapters/controllers'
import { BaseChartWidget } from './BaseChartWidget'
import {
  ChartOptionsBuilder,
  CHART_CONSTANTS,
} from '../../shared/chartConfigFactory'
import { formatChartValue, formatDays } from '../../shared/chartUtils'
import { DeadlineData } from '../../../domain/useCases'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const COUNT_DAYS_RANGE = [7, 15, 30]

interface DeadlineWidgetProps {
  data: DeadlineData
}

const DeadlineWidgetComponent: React.FC<DeadlineWidgetProps> = (props: DeadlineWidgetProps) => {
    const { deadlineComplianceDays, setDeadlineComplianceDays } =
      useDashboardSearchParams()
    const { data } = props;
    const selectedDays = deadlineComplianceDays
    const chartData = useDeadlineChartData(data, selectedDays)

    const handleDaysChange = setDeadlineComplianceDays

    const options = new ChartOptionsBuilder()
      .forScatter()
      .responsive(true)
      .withLegend(false)
      .withPadding(0)
      .withXAxis({
        formatter: formatDays,
        title: "Jours depuis aujourd'hui",
        grid: true,
      })
      .withYAxis({
        formatter: formatChartValue,
        title: 'Montant (€)',
        grid: true,
      })
      .withTooltipFormatter((context: { parsed: { x: number; y: number } }) => {
        const days = context.parsed.x
        const amount = context.parsed.y
        const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' })
        const relative = rtf.format(days, 'day')
        return `${amount.toLocaleString('fr-FR')}€, ${relative}`
      })
      .withXAxisRange(-selectedDays, selectedDays)
      .withXAxisStepSize(selectedDays % 6)
      .build()

    return (
      <BaseChartWidget title="Respect des Échéances">
        <div className="mb-0">
          <div className="btn-group" role="group">
            {COUNT_DAYS_RANGE.map((days) => (
              <button
                key={days}
                type="button"
                className={
                  selectedDays === days
                    ? 'btn btn-primary'
                    : 'btn btn-outline-primary'
                }
                onClick={() => handleDaysChange(days)}
              >
                {days} jours
              </button>
            ))}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <Scatter
            data={chartData}
            options={options}
            height={CHART_CONSTANTS.DEADLINE_HEIGHT}
          />
        </div>
      </BaseChartWidget>
    )
}

DeadlineWidgetComponent.displayName = 'DeadlineWidget'

export const DeadlineWidget = React.memo(DeadlineWidgetComponent)
