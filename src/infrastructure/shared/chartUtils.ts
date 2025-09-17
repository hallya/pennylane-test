/**
 * Formats a number for display in charts with adaptive scaling and € symbol
 * @param value - The numeric value to format
 * @param maxValue - The maximum value in the dataset for context
 * @returns Formatted string with appropriate scaling and € symbol
 */
export const formatChartValue = (value: number, maxValue?: number): string => {
  const absValue = Math.abs(value);

  if (maxValue) {
    if (maxValue >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M€`;
    } else if (maxValue >= 1_0000) {
      return `${(value / 1_000).toFixed(0)}k€`;
    } else if (maxValue >= 1_000) {
      return `${(value / 1_000).toFixed(1)}k€`;
    }
  } else {
    if (absValue >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M€`;
    } else if (absValue >= 1_000) {
      return `${(value / 1_000).toFixed(1)}k€`;
    }
  }

  return `${value}€`;
};

/**
 * Formats a number as currency for tooltips
 * @param value - The numeric value to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats a number as plain number for charts (no units)
 * @param value - The numeric value to format
 * @param maxValue - The maximum value for scaling context
 * @returns Formatted plain number string
 */
export const formatPlainNumber = (value: number, maxValue?: number): string => {
  const absValue = Math.abs(value);

  if (maxValue) {
    if (maxValue >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (maxValue >= 10_000) {
      return `${(value / 1_000).toFixed(0)}k`;
    } else if (maxValue >= 1_000) {
      return `${(value / 1_000).toFixed(1)}k`;
    }
  } else {
    if (absValue >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (absValue >= 1_000) {
      return `${(value / 1_000).toFixed(1)}k`;
    }
  }

  return value.toString();
};

/**
 * Formats a number as percentage for charts
 * @param value - The numeric value to format (assumed to be decimal, e.g., 0.15 for 15%)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Formats a number as days for charts
 * @param value - The numeric value to format
 * @returns Formatted days string
 */
export const formatDays = (value: number): string => {
  return `${value} j`;
};


/**
 * Consistent color palette for all dashboard charts
 */
export const CHART_COLORS = {
  primary: '#0d6efd',    
  secondary: '#6c757d',  
  success: '#198754',    
  info: '#0dcaf0',       
  warning: '#ffc107',    
  danger: '#dc3545',     
  light: '#f8f9fa',      
  dark: '#212529',       
} as const;

/**
 * Array of colors for multiple data points
 */
export const CHART_COLOR_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.info,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
] as const;