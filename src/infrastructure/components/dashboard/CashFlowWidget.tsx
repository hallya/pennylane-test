import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { CashFlowData } from '../../../domain/useCases'
import { BaseChartWidget } from './BaseChartWidget'
import {
  ChartOptionsBuilder,
  useChartData,
  CHART_CONSTANTS,
} from '../../shared/chartConfigFactory'
import { formatChartValue } from '../../shared/chartUtils'
import { CHART_COLOR_PALETTE } from '../../shared/chartUtils'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface CashFlowWidgetProps {
  data: CashFlowData
}

const CashFlowWidgetComponent: React.FC<CashFlowWidgetProps> = ({ data }) => {
    const rawData = [
      { label: 'Émis', value: data.totalIssued },
      { label: 'Encours', value: data.outstandingReceivables },
      { label: 'Reçus', value: data.totalReceived },
    ]
    const sortedData = rawData.sort((a, b) => b.value - a.value)
    const { values } = useChartData(
      sortedData,
      (item) => item.value,
      formatChartValue
    )
    const labels = sortedData.map((item) => item.label)

    const chartData = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: CHART_COLOR_PALETTE.slice(0, 3),
          borderColor: CHART_COLOR_PALETTE.slice(0, 3),
          borderWidth: CHART_CONSTANTS.BORDER_WIDTH,
        },
      ],
    }

    const options = new ChartOptionsBuilder()
      .forHorizontalBar()
      .responsive(true)
      .withLegend(false)
      .withPadding(0)
      .withCurrencyFormatting()
      .withTooltipFormatter((context: { parsed: { x: number }; label: string }) => {
        const value = context.parsed.x
        return `${context.label}: ${value.toLocaleString('fr-FR')}€`
      })
      .build()

    return (
      <BaseChartWidget title="Flux de Trésorerie">
        <div>
          <Bar
            data={chartData}
            options={options}
            height={CHART_CONSTANTS.CASH_FLOW_HEIGHT}
          />
        </div>
        {data.isAtRisk && (
          <div className="alert alert-danger mb-0 p-2">
            ⚠️ Trésorerie en danger : Encours élevé ou DSO {'>'} 30 jours
          </div>
        )}
        <p className="mb-0 small">DSO: {data.dso.toFixed(2)} jours</p>
      </BaseChartWidget>
    )
}

CashFlowWidgetComponent.displayName = 'CashFlowWidget'

export const CashFlowWidget = React.memo(CashFlowWidgetComponent)
