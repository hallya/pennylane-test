import { ChartOptions } from 'chart.js';

/**
 * Chart configuration types
 */
export type ChartType = 'verticalBar' | 'horizontalBar' | 'scatter';

/**
 * Tooltip context interface for Chart.js
 */
export interface ChartTooltipContext {
  parsed: { x: number; y: number };
  label: string;
}

/**
 * Tick callback function type for Chart.js scales
 */
export type TickCallback = (tickValue: string | number) => string;

/**
 * Extended chart options with proper typing
 */
export interface ExtendedChartOptions extends ChartOptions {
  plugins?: {
    legend?: { display: boolean };
    tooltip?: {
      callbacks?: {
        label?: (context: ChartTooltipContext) => string;
      };
    };
  };
  scales?: {
    x?: {
      beginAtZero?: boolean;
      grid?: { display: boolean };
      ticks?: {
        callback?: TickCallback;
        font?: { size: number };
        stepSize?: number;
      };
      title?: { display: boolean; text: string };
      suggestedMin?: number;
      suggestedMax?: number;
      [key: string]: any;
    };
    y?: {
      beginAtZero?: boolean;
      grid?: { display: boolean };
      ticks?: {
        callback?: TickCallback;
        font?: { size: number };
      };
      title?: { display: boolean; text: string };
      [key: string]: any;
    };
  };
  indexAxis?: 'x' | 'y';
}