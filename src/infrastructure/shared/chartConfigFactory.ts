import { formatChartValue, formatCurrency, CHART_COLOR_PALETTE } from './chartUtils';
import { ChartType, ExtendedChartOptions, ChartTooltipContext } from './chartTypes';

/**
 * Factory function to create consistent chart options
 */
export const createChartOptions = (
  type: ChartType,
  maxValue?: number,
  customOptions?: Partial<ExtendedChartOptions>
): ExtendedChartOptions => {
  const baseOptions: ExtendedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1.5,
    layout: { padding: 0 },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: ChartTooltipContext) => {
            const value = type === 'horizontalBar' ? context.parsed.x : context.parsed.y;
            return `${context.label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { display: false },
        ticks: {
          callback: (tickValue: string | number) => {
            if (typeof tickValue === 'number') {
              return formatChartValue(tickValue, maxValue);
            }
            return tickValue;
          },
          font: { size: 10 },
        },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: {
          callback: (tickValue: string | number) => {
            if (typeof tickValue === 'number') {
              return formatChartValue(tickValue, maxValue);
            }
            return tickValue;
          },
          font: { size: 10 },
        },
      },
    },
  };

  const typeSpecificOptions = {
    verticalBar: {},
    horizontalBar: {
      indexAxis: 'y' as const,
    },
    scatter: {
      aspectRatio: 0.8,
      scales: {
        ...baseOptions.scales,
        x: {
          ...baseOptions.scales?.x,
          ticks: {
            ...baseOptions.scales?.x?.ticks,
            callback: (tickValue: string | number) => {
              if (typeof tickValue === 'number') {
                return `${tickValue} j`;
              }
              return tickValue;
            },
          },
        },
      },
    },
  };

  return {
    ...baseOptions,
    ...typeSpecificOptions[type],
    ...customOptions,
  };
};

/**
 * Hook for processing chart data with consistent formatting
 */
export const useChartData = (rawData: any[], valueExtractor: (item: any) => number) => {
  const values = rawData.map(valueExtractor);
  const maxValue = values.length > 0 ? Math.max(...values) : 0;

  return {
    values,
    maxValue,
    formattedValues: values.map(v => formatChartValue(v, maxValue)),
  };
};

/**
 * Common chart colors and styling constants
 */
export const CHART_CONSTANTS = {
  HEIGHT: 300,
  WIDTH: 400,
  DEADLINE_HEIGHT: 350,
  COLORS: CHART_COLOR_PALETTE,
  BORDER_WIDTH: 1,
  FONT_SIZE: 12,
} as const;