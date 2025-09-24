import {
  ChartOptionsBuilder,
  createHorizontalBarBaseOptions,
  useChartData,
  CHART_CONSTANTS,
} from '../chartConfigFactory'

describe('chartConfigFactory', () => {
  describe('ChartOptionsBuilder', () => {
    it('builds empty options by default', () => {
      const builder = new ChartOptionsBuilder()
      const options = builder.build()
      expect(options).toEqual({})
    })

    it('configures horizontal bar chart', () => {
      const options = new ChartOptionsBuilder()
        .forHorizontalBar()
        .build()

      expect(options.indexAxis).toBe('y')
    })

    it('configures scatter chart', () => {
      const options = new ChartOptionsBuilder()
        .forScatter()
        .build()

      expect(options.aspectRatio).toBe(0.8)
    })

    it('sets responsive behavior', () => {
      const options = new ChartOptionsBuilder()
        .responsive(false)
        .build()

      expect(options.responsive).toBe(false)
      expect(options.maintainAspectRatio).toBe(true)
    })

    it('sets padding', () => {
      const options = new ChartOptionsBuilder()
        .withPadding(10)
        .build()

      expect(options.layout?.padding).toBe(10)
    })

    it('sets legend configuration', () => {
      const options = new ChartOptionsBuilder()
        .withLegend(false, 'bottom')
        .build()

      expect(options.plugins?.legend?.display).toBe(false)
      expect(options.plugins?.legend?.position).toBe('bottom')
    })

    it('sets tooltip formatter', () => {
      const mockFormatter = vi.fn(() => 'formatted')
      const options = new ChartOptionsBuilder()
        .withTooltipFormatter(mockFormatter)
        .build()

      expect(options.plugins?.tooltip?.callbacks?.label).toBeDefined()
    })

    it('configures X-axis', () => {
      const options = new ChartOptionsBuilder()
        .withXAxis({
          beginAtZero: false,
          grid: true,
          title: 'Test X',
          fontSize: 14,
        })
        .build()

      expect(options.scales?.x?.beginAtZero).toBe(false)
      expect(options.scales?.x?.grid?.display).toBe(true)
      expect(options.scales?.x?.title?.text).toBe('Test X')
      expect(options.scales?.x?.ticks?.font?.size).toBe(14)
    })

    it('configures Y-axis', () => {
      const options = new ChartOptionsBuilder()
        .withYAxis({
          beginAtZero: true,
          grid: false,
          title: 'Test Y',
        })
        .build()

      expect(options.scales?.y?.beginAtZero).toBe(true)
      expect(options.scales?.y?.grid?.display).toBe(false)
      expect(options.scales?.y?.title?.text).toBe('Test Y')
    })

    it('sets X-axis range', () => {
      const options = new ChartOptionsBuilder()
        .withXAxisRange(-10, 10)
        .build()

      expect(options.scales?.x?.suggestedMin).toBe(-10)
      expect(options.scales?.x?.suggestedMax).toBe(10)
    })

    it('sets X-axis step size', () => {
      const options = new ChartOptionsBuilder()
        .withXAxisStepSize(5)
        .build()

      expect(options.scales?.x?.ticks?.stepSize).toBe(5)
    })

    it('applies currency formatting', () => {
      const options = new ChartOptionsBuilder()
        .withCurrencyFormatting()
        .build()

      expect(options.plugins?.tooltip?.callbacks?.label).toBeDefined()
      expect(options.scales?.x?.ticks?.callback).toBeDefined()
    })

    it('overrides options', () => {
      const options = new ChartOptionsBuilder()
        .withOptions({ responsive: false })
        .build()

      expect(options.responsive).toBe(false)
    })

    it('chains methods fluently', () => {
      const options = new ChartOptionsBuilder()
        .responsive(true)
        .withLegend(true)
        .withXAxis({ beginAtZero: true })
        .build()

      expect(options.responsive).toBe(true)
      expect(options.plugins?.legend?.display).toBe(true)
      expect(options.scales?.x?.beginAtZero).toBe(true)
    })
  })

  describe('createHorizontalBarBaseOptions', () => {
    it('returns base options for horizontal bar', () => {
      const options = createHorizontalBarBaseOptions()

      expect(options.responsive).toBe(true)
      expect(options.maintainAspectRatio).toBe(false)
      expect(options.indexAxis).toBe('y')
      expect(options.layout?.padding).toBe(0)
      expect(options.plugins?.legend?.display).toBe(false)
      expect(options.scales?.x?.beginAtZero).toBe(true)
      expect(options.scales?.y?.beginAtZero).toBe(true)
    })
  })

  describe('useChartData', () => {
    it('processes raw data with default formatter', () => {
      const rawData = [
        { value: 1000 },
        { value: 2000 },
        { value: 1500 },
      ]

      const result = useChartData(rawData, (item) => item.value)

      expect(result.values).toEqual([1000, 2000, 1500])
      expect(result.maxValue).toBe(2000)
      expect(result.formattedValues).toEqual(['1.0k', '2.0k', '1.5k'])
    })

    it('uses custom formatter', () => {
      const rawData = [{ value: 0.5 }, { value: 0.8 }]
      const customFormatter = (value: number) => `${(value * 100).toFixed(0)}%`

      const result = useChartData(rawData, (item) => item.value, customFormatter)

      expect(result.values).toEqual([0.5, 0.8])
      expect(result.formattedValues).toEqual(['50%', '80%'])
    })

    it('handles empty data', () => {
      const result = useChartData([] as { value: number }[], (item) => item.value)

      expect(result.values).toEqual([])
      expect(result.maxValue).toBe(0)
      expect(result.formattedValues).toEqual([])
    })

    it('handles single item', () => {
      const result = useChartData([{ value: 500 }], (item) => item.value)

      expect(result.values).toEqual([500])
      expect(result.maxValue).toBe(500)
      expect(result.formattedValues).toEqual(['500'])
    })
  })

  describe('CHART_CONSTANTS', () => {
    it('contains expected constants', () => {
      expect(CHART_CONSTANTS.HEIGHT).toBe(300)
      expect(CHART_CONSTANTS.WIDTH).toBe(400)
      expect(CHART_CONSTANTS.BORDER_WIDTH).toBe(1)
      expect(CHART_CONSTANTS.FONT_SIZE).toBe(12)
    })

    it('contains colors array', () => {
      expect(CHART_CONSTANTS.COLORS).toBeDefined()
      expect(Array.isArray(CHART_CONSTANTS.COLORS)).toBe(true)
    })
  })
})