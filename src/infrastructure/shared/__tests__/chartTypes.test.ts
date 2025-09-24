import { ChartType, ExtendedChartOptions } from '../chartTypes'

describe('chartTypes', () => {
  describe('ChartType', () => {
    it('includes expected chart types', () => {
      const types: ChartType[] = ['verticalBar', 'horizontalBar', 'scatter']
      expect(types).toContain('verticalBar')
      expect(types).toContain('horizontalBar')
      expect(types).toContain('scatter')
    })
  })

  describe('ExtendedChartOptions', () => {
    it('can be created with basic options', () => {
      const options: ExtendedChartOptions = {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
      }
      expect(options.responsive).toBe(true)
      expect(options.plugins?.legend?.display).toBe(true)
    })

    it('supports extended properties', () => {
      const options: ExtendedChartOptions = {
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            grid: { display: false },
            ticks: {
              callback: (value) => `${value}€`,
              font: { size: 12 },
            },
          },
        },
      }
      expect(options.indexAxis).toBe('y')
      expect(options.scales?.x?.beginAtZero).toBe(true)
    })
  })
})