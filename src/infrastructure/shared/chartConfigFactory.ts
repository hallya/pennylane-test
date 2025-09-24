import {
  formatChartValue,
  formatPlainNumber,
  CHART_COLOR_PALETTE,
} from './chartUtils'
import { ExtendedChartOptions } from './chartTypes'

/**
 * Type for configurable chart value formatters
 */
export type ChartValueFormatter = (value: number, maxValue?: number) => string

/**
 * Flexible builder class for chart options
 * Provides granular control over all chart aspects
 */
export class ChartOptionsBuilder {
  private options: ExtendedChartOptions = {}

  /**
   * Configure as horizontal bar chart
   */
  forHorizontalBar(): this {
    this.options = {
      ...this.options,
      indexAxis: 'y' as const,
    }
    return this
  }

  /**
   * Configure as scatter chart
   */
  forScatter(): this {
    this.options = {
      ...this.options,
      aspectRatio: 0.8,
    }
    return this
  }

  /**
   * Set responsive behavior
   */
  responsive(enabled: boolean = true): this {
    this.options = {
      ...this.options,
      responsive: enabled,
      maintainAspectRatio: !enabled,
    }
    return this
  }

  /**
   * Set layout padding
   */
  withPadding(
    padding:
      | number
      | { top?: number; bottom?: number; left?: number; right?: number }
  ): this {
    this.options = {
      ...this.options,
      layout: { padding },
    }
    return this
  }

  /**
   * Configure legend display
   */
  withLegend(
    display: boolean = true,
    position: 'top' | 'bottom' | 'left' | 'right' = 'top'
  ): this {
    this.options = {
      ...this.options,
      plugins: {
        ...this.options.plugins,
        legend: {
          display,
          position,
        },
      },
    }
    return this
  }

  /**
   * Configure tooltip formatting
   */
  withTooltipFormatter(
    formatter:
      | ChartValueFormatter
      | ((context: {
          parsed: { x: number; y: number }
          label: string
        }) => string)
  ): this {
    const isHorizontalBar = this.options.indexAxis === 'y'

    this.options = {
      ...this.options,
      plugins: {
        ...this.options.plugins,
        tooltip: {
          ...this.options.plugins?.tooltip,
          callbacks: {
            ...this.options.plugins?.tooltip?.callbacks,
            label:
              typeof formatter === 'function' && formatter.length === 1
                ? (formatter as (context: {
                    parsed: { x: number; y: number }
                    label: string
                  }) => string)
                : (context) =>
                    `${context.label}: ${(formatter as ChartValueFormatter)(
                      isHorizontalBar ? context.parsed.x : context.parsed.y
                    )}`,
          },
        },
      },
    }
    return this
  }

  /**
   * Configure X-axis
   */
  withXAxis(config: {
    beginAtZero?: boolean
    grid?: boolean
    formatter?: ChartValueFormatter
    title?: string
    fontSize?: number
  }): this {
    this.options = {
      ...this.options,
      scales: {
        ...this.options.scales,
        x: {
          ...this.options.scales?.x,
          beginAtZero: config.beginAtZero ?? true,
          grid: { display: config.grid ?? false },
          title: config.title
            ? { display: true, text: config.title }
            : undefined,
          ticks: {
            ...this.options.scales?.x?.ticks,
            callback: config.formatter
              ? (value) => config.formatter!(value as number)
              : this.options.scales?.x?.ticks?.callback,
            font: { size: config.fontSize ?? 10 },
          },
        },
      },
    }
    return this
  }

  /**
   * Configure Y-axis
   */
  withYAxis(config: {
    beginAtZero?: boolean
    grid?: boolean
    formatter?: ChartValueFormatter
    title?: string
    fontSize?: number
  }): this {
    this.options = {
      ...this.options,
      scales: {
        ...this.options.scales,
        y: {
          ...this.options.scales?.y,
          beginAtZero: config.beginAtZero ?? true,
          grid: { display: config.grid ?? false },
          title: config.title
            ? { display: true, text: config.title }
            : undefined,
          ticks: {
            ...this.options.scales?.y?.ticks,
            callback: config.formatter
              ? (value) => config.formatter!(value as number)
              : this.options.scales?.y?.ticks?.callback,
            font: { size: config.fontSize ?? 10 },
          },
        },
      },
    }
    return this
  }

  /**
   * Set X-axis suggested range
   */
  withXAxisRange(min: number, max: number): this {
    this.options = {
      ...this.options,
      scales: {
        ...this.options.scales,
        x: {
          ...this.options.scales?.x,
          suggestedMin: min,
          suggestedMax: max,
        },
      },
    }
    return this
  }

  /**
   * Set X-axis tick step size
   */
  withXAxisStepSize(size: number): this {
    this.options = {
      ...this.options,
      scales: {
        ...this.options.scales,
        x: {
          ...this.options.scales?.x,
          ticks: {
            ...this.options.scales?.x?.ticks,
            stepSize: size,
          },
        },
      },
    }
    return this
  }

  /**
   * Apply standard formatting for currency (only if not already set)
   */
  withCurrencyFormatting(): this {
    if (!this.options.plugins?.tooltip?.callbacks?.label) {
      this.withTooltipFormatter(formatChartValue)
    }

    if (!this.options.scales?.x?.ticks?.callback) {
      this.withXAxis({ formatter: formatChartValue })
    }

    if (
      !this.options.scales?.y?.ticks?.callback &&
      this.options.indexAxis !== 'y'
    ) {
      this.withYAxis({ formatter: formatChartValue })
    }

    return this
  }

  /**
   * Add or override any options
   */
  withOptions(options: Partial<ExtendedChartOptions>): this {
    this.options = { ...this.options, ...options }
    return this
  }

  /**
   * Get the final options
   */
  build(): ExtendedChartOptions {
    return this.options
  }
}

/**
 * Factory function for horizontal bar chart base options
 */
export const createHorizontalBarBaseOptions = (): ExtendedChartOptions => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  layout: { padding: 0 },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) =>
          `${context.label}: ${formatPlainNumber(context.parsed.x)}`,
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: { display: false },
      ticks: {
        callback: (value) => formatPlainNumber(value as number),
        font: { size: 10 },
      },
    },
    y: {
      beginAtZero: true,
      grid: { display: false },
      ticks: {
        callback: (value) => formatPlainNumber(value as number),
        font: { size: 10 },
      },
    },
  },
})

/**
 * Hook for processing chart data with consistent formatting
 * @param rawData - Array of raw data items
 * @param valueExtractor - Function to extract numeric value from each item
 * @param formatter - Optional formatter for values (defaults to plain number formatting)
 */
export const useChartData = <T>(
  rawData: T[],
  valueExtractor: (item: T) => number,
  formatter: ChartValueFormatter = formatPlainNumber
) => {
  const values = rawData.map(valueExtractor)
  const maxValue = values.length > 0 ? Math.max(...values) : 0

  return {
    values,
    maxValue,
    formattedValues: values.map((v) => formatter(v, maxValue)),
  }
}

/**
 * Common chart colors and styling constants
 */
export const CHART_CONSTANTS = {
  HEIGHT: 300,
  WIDTH: 400,
  DEADLINE_HEIGHT: 300,
  CASH_FLOW_HEIGHT: 150,
  COLORS: CHART_COLOR_PALETTE,
  BORDER_WIDTH: 1,
  FONT_SIZE: 12,
} as const
