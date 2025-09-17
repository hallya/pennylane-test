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
   * Set aspect ratio
   */
  withAspectRatio(ratio: number): this {
    this.options = {
      ...this.options,
      aspectRatio: ratio,
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
        } as any,
      },
    }
    return this
  }

  /**
   * Configure tooltip formatting
   */
  withTooltipFormatter(
    formatter: ChartValueFormatter | ((context: any) => string)
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
                ? (formatter as (context: any) => string)
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
   * Set Y-axis suggested range
   */
  withYAxisRange(min: number, max: number): this {
    this.options = {
      ...this.options,
      scales: {
        ...this.options.scales,
        y: {
          ...this.options.scales?.y,
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
          } as any,
        },
      },
    }
    return this
  }

  /**
   * Set Y-axis tick step size
   */
  withYAxisStepSize(size: number): this {
    this.options = {
      ...this.options,
      scales: {
        ...this.options.scales,
        y: {
          ...this.options.scales?.y,
          ticks: {
            ...this.options.scales?.y?.ticks,
            stepSize: size,
          } as any,
        },
      },
    }
    return this
  }

  /**
   * Set chart height
   */
  withHeight(height: number): this {
    this.options = {
      ...this.options,
      plugins: {
        ...this.options.plugins,

        ...({ height } as any),
      },
    }
    return this
  }

  /**
   * Apply standard formatting for plain numbers (only if not already set)
   */
  withPlainNumberFormatting(): this {
    if (!this.options.plugins?.tooltip?.callbacks?.label) {
      this.withTooltipFormatter(formatPlainNumber)
    }

    if (!this.options.scales?.x?.ticks?.callback) {
      this.withXAxis({ formatter: formatPlainNumber })
    }
    if (!this.options.scales?.y?.ticks?.callback) {
      this.withYAxis({ formatter: formatPlainNumber })
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
 * Factory function for scatter chart base options
 */
export const createScatterBaseOptions = (): ExtendedChartOptions => ({
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  layout: { padding: 0 },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) =>
          `${context.label}: ${formatPlainNumber(context.parsed.y)}`,
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
 * Apply currency formatting to chart options
 */
export const withCurrencyFormatting = (
  options: ExtendedChartOptions
): ExtendedChartOptions => {
  const isHorizontalBar = options.indexAxis === 'y'

  return {
    ...options,
    plugins: {
      ...options.plugins,
      tooltip: {
        ...options.plugins?.tooltip,
        callbacks: {
          ...options.plugins?.tooltip?.callbacks,
          label: (context) =>
            `${context.label}: ${formatChartValue(
              isHorizontalBar ? context.parsed.x : context.parsed.y
            )}`,
        },
      },
    },
    scales: {
      ...options.scales,
      x: {
        ...options.scales?.x,
        ticks: {
          ...options.scales?.x?.ticks,
          callback: (value) => formatChartValue(value as number),
        },
      },
      y: {
        ...options.scales?.y,
        ticks: {
          ...options.scales?.y?.ticks,
          callback: (value) => formatChartValue(value as number),
        },
      },
    },
  }
}

/**
 * Apply custom formatting to chart options
 */
export const withCustomFormatting = (
  options: ExtendedChartOptions,
  formatters: {
    x?: ChartValueFormatter
    y?: ChartValueFormatter
    tooltip?: ChartValueFormatter
  }
): ExtendedChartOptions => {
  const isHorizontalBar = options.indexAxis === 'y'

  return {
    ...options,
    plugins: {
      ...options.plugins,
      tooltip: {
        ...options.plugins?.tooltip,
        callbacks: {
          ...options.plugins?.tooltip?.callbacks,
          label: formatters.tooltip
            ? (context) =>
                `${context.label}: ${formatters.tooltip!(
                  isHorizontalBar ? context.parsed.x : context.parsed.y
                )}`
            : options.plugins?.tooltip?.callbacks?.label,
        },
      },
    },
    scales: {
      ...options.scales,
      x: {
        ...options.scales?.x,
        ticks: {
          ...options.scales?.x?.ticks,
          callback: formatters.x
            ? (value) => formatters.x!(value as number)
            : options.scales?.x?.ticks?.callback,
        },
      },
      y: {
        ...options.scales?.y,
        ticks: {
          ...options.scales?.y?.ticks,
          callback: formatters.y
            ? (value) => formatters.y!(value as number)
            : options.scales?.y?.ticks?.callback,
        },
      },
    },
  }
}

/**
 * Hook for processing chart data with consistent formatting
 * @param rawData - Array of raw data items
 * @param valueExtractor - Function to extract numeric value from each item
 * @param formatter - Optional formatter for values (defaults to plain number formatting)
 */
export const useChartData = (
  rawData: any[],
  valueExtractor: (item: any) => number,
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
  DEADLINE_HEIGHT: 350,
  CASH_FLOW_HEIGHT: 150,
  COLORS: CHART_COLOR_PALETTE,
  BORDER_WIDTH: 1,
  FONT_SIZE: 12,
} as const
