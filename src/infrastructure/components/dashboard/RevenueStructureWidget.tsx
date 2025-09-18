import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { RevenueStructureData } from '../../../domain/useCases'
import { BaseChartWidget } from './BaseChartWidget'
import { ChartOptionsBuilder, useChartData } from '../../shared/chartConfigFactory'
import { CHART_COLOR_PALETTE } from '../../shared/chartUtils'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface RevenueStructureWidgetProps {
  data: RevenueStructureData
}

export const RevenueStructureWidget: React.FC<RevenueStructureWidgetProps> =
  React.memo(({ data }) => {
    const { values: clientValues } = useChartData(
      data.byClient.slice(0, 5),
      (client) => client.revenue
    )
    const { values: vatValues } = useChartData(
      data.byVatRate,
      (vatRate) => vatRate.revenue
    )

    const clientLabels = data.byClient.slice(0, 5).map((c) => c.name)

    const clientData = {
      labels: clientLabels,
      datasets: [
        {
          data: clientValues,
          backgroundColor: CHART_COLOR_PALETTE.slice(0, 5),
          borderColor: CHART_COLOR_PALETTE.slice(0, 5),
          borderWidth: 1,
        },
      ],
    }

    const vatData = {
      labels: data.byVatRate.map((v) => `TVA ${v.vatRate}%`),
      datasets: [
        {
          data: vatValues,
          backgroundColor: CHART_COLOR_PALETTE.slice(0, data.byVatRate.length),
          borderColor: CHART_COLOR_PALETTE.slice(0, data.byVatRate.length),
          borderWidth: 1,
        },
      ],
    }

    const clientOptions = new ChartOptionsBuilder()
      .forHorizontalBar()
      .responsive(false)
      .withLegend(false)
      .withPadding(0)
      .withCurrencyFormatting()
      .withTooltipFormatter((context: any) => {
        const value = context.parsed.x;
        return `${context.label}: ${value.toLocaleString('fr-FR')}€`
      })
      .build()

    const vatOptions = new ChartOptionsBuilder()
      .forHorizontalBar()
      .responsive(false)
      .withLegend(false)
      .withPadding(0)
      .withCurrencyFormatting()
      .withTooltipFormatter((context: any) => {
        const value = context.parsed.x;
        return `${context.label}: ${value.toLocaleString('fr-FR')}€`
      })
      .build()

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
    )
  })
