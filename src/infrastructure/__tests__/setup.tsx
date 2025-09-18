import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  BarElement: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
}))

vi.mock('react-chartjs-2', () => ({
  Bar: ({ data, options }: any) => (
    <div
      data-testid="bar-chart"
      data-data={JSON.stringify(data)}
      data-options={JSON.stringify(options)}
    />
  ),
}))
