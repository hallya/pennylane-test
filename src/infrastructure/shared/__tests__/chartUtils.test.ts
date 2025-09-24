import {
  formatChartValue,
  formatCurrency,
  formatPlainNumber,
  formatPercentage,
  formatDays,
  CHART_COLORS,
  CHART_COLOR_PALETTE,
} from '../chartUtils'

describe('chartUtils', () => {
  describe('formatChartValue', () => {
    it('formats small values without scaling', () => {
      expect(formatChartValue(500)).toBe('500€')
      expect(formatChartValue(-500)).toBe('-500€')
    })

    it('formats values in thousands with k€', () => {
      expect(formatChartValue(1500)).toBe('1.5k€')
      expect(formatChartValue(2500, 10000)).toBe('3k€')
    })

    it('formats values in millions with M€', () => {
      expect(formatChartValue(1500000)).toBe('1.5M€')
      expect(formatChartValue(2500000, 10000000)).toBe('2.5M€')
    })

    it('uses maxValue for scaling context', () => {
      expect(formatChartValue(1500, 1000000)).toBe('0.0M€')
      expect(formatChartValue(1500, 10000)).toBe('2k€')
    })

    it('handles zero and negative values', () => {
      expect(formatChartValue(0)).toBe('0€')
      expect(formatChartValue(-1500)).toBe('-1.5k€')
    })
  })

  describe('formatCurrency', () => {
    it('formats values as French currency', () => {
      expect(formatCurrency(1234.56)).toBe('1\u202F235\u00A0€')
      expect(formatCurrency(0)).toBe('0\u00A0€')
      expect(formatCurrency(-500)).toBe('-500\u00A0€')
    })

    it('rounds to whole numbers', () => {
      expect(formatCurrency(1234.56)).toBe('1\u202F235\u00A0€')
      expect(formatCurrency(1234.1)).toBe('1\u202F234\u00A0€')
    })
  })

  describe('formatPlainNumber', () => {
    it('formats small values without scaling', () => {
      expect(formatPlainNumber(500)).toBe('500')
      expect(formatPlainNumber(-500)).toBe('-500')
    })

    it('formats values in thousands with k', () => {
      expect(formatPlainNumber(1500)).toBe('1.5k')
      expect(formatPlainNumber(2500, 10000)).toBe('3k')
    })

    it('formats values in millions with M', () => {
      expect(formatPlainNumber(1500000)).toBe('1.5M')
      expect(formatPlainNumber(2500000, 10000000)).toBe('2.5M')
    })

    it('uses maxValue for scaling context', () => {
      expect(formatPlainNumber(1500, 1000000)).toBe('0.0M')
      expect(formatPlainNumber(1500, 10000)).toBe('2k')
    })
  })

  describe('formatPercentage', () => {
    it('formats decimal values as percentages', () => {
      expect(formatPercentage(0.15)).toBe('15.0%')
      expect(formatPercentage(0.5)).toBe('50.0%')
      expect(formatPercentage(1)).toBe('100.0%')
    })

    it('handles negative percentages', () => {
      expect(formatPercentage(-0.15)).toBe('-15.0%')
    })
  })

  describe('formatDays', () => {
    it('formats numbers as days with j suffix', () => {
      expect(formatDays(5)).toBe('5 j')
      expect(formatDays(-3)).toBe('-3 j')
      expect(formatDays(0)).toBe('0 j')
    })
  })

  describe('CHART_COLORS', () => {
    it('contains expected color values', () => {
      expect(CHART_COLORS.primary).toBe('#0d6efd')
      expect(CHART_COLORS.secondary).toBe('#6c757d')
      expect(CHART_COLORS.success).toBe('#198754')
      expect(CHART_COLORS.danger).toBe('#dc3545')
    })
  })

  describe('CHART_COLOR_PALETTE', () => {
    it('contains array of colors from CHART_COLORS', () => {
      expect(CHART_COLOR_PALETTE).toEqual([
        CHART_COLORS.primary,
        CHART_COLORS.secondary,
        CHART_COLORS.success,
        CHART_COLORS.info,
        CHART_COLORS.warning,
        CHART_COLORS.danger,
      ])
    })

    it('has correct length', () => {
      expect(CHART_COLOR_PALETTE).toHaveLength(6)
    })
  })
})