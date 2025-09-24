import { renderHook } from '@testing-library/react'
import { useDeadlineChartData } from '../useDeadlineChartData'
import { DeadlineDataTestFactory } from '../../../__tests__/utils/deadlineDataTestFactory'

describe('useDeadlineChartData', () => {
  beforeEach(() => {
    const mockNow = new Date('2024-01-15T10:00:00Z')
    vi.setSystemTime(mockNow)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns empty datasets for empty data', () => {
    const { result } = renderHook(() =>
      useDeadlineChartData(DeadlineDataTestFactory.empty(), 30)
    )

    expect(result.current.datasets).toHaveLength(2)
    expect(result.current.datasets[0].data).toEqual([])
    expect(result.current.datasets[1].data).toEqual([])
  })

  it('processes due soon invoices correctly', () => {
    const data = DeadlineDataTestFactory.withSpecificDueSoon('2024-01-20', '1000')

    const { result } = renderHook(() =>
      useDeadlineChartData(data, 30)
    )

    expect(result.current.datasets[0].data).toHaveLength(1)
    expect(result.current.datasets[0].data[0]).toEqual({
      x: 5,
      y: 1000,
    })
  })

  it('processes overdue invoices correctly', () => {
    const data = DeadlineDataTestFactory.withSpecificOverdue('2024-01-10', '1500')

    const { result } = renderHook(() =>
      useDeadlineChartData(data, 30)
    )

    expect(result.current.datasets[1].data).toHaveLength(1)
    expect(result.current.datasets[1].data[0]).toEqual({
      x: -6,
      y: 1500,
    })
  })

  it('filters data based on selected days', () => {
    const data = DeadlineDataTestFactory.create({
      dueSoon: [
        ...DeadlineDataTestFactory.withSpecificDueSoon('2024-01-20', '1000').dueSoon,
        ...DeadlineDataTestFactory.withSpecificDueSoon('2024-02-20', '2000').dueSoon,
      ],
    })

    const { result } = renderHook(() =>
      useDeadlineChartData(data, 30)
    )

    expect(result.current.datasets[0].data).toHaveLength(1)
    expect(result.current.datasets[0].data[0].y).toBe(1000)
  })

  it('handles invoices with null deadline', () => {
    const data = DeadlineDataTestFactory.withInvoiceWithoutDeadline('500')

    const { result } = renderHook(() =>
      useDeadlineChartData(data, 30)
    )

    expect(result.current.datasets[0].data).toHaveLength(0)
  })

  it('calculates days difference correctly for edge cases', () => {
    const data = DeadlineDataTestFactory.create({
      dueSoon: [
        ...DeadlineDataTestFactory.withSpecificDueSoon('2024-01-15T10:00:00Z', '100').dueSoon,
        ...DeadlineDataTestFactory.withSpecificDueSoon('2024-01-16', '200').dueSoon,
      ],
    })

    const { result } = renderHook(() =>
      useDeadlineChartData(data, 30)
    )

    expect(result.current.datasets[0].data).toHaveLength(2)
    expect(result.current.datasets[0].data[0].x).toBe(0)
    expect(result.current.datasets[0].data[1].x).toBe(1)
  })

  it('sets correct dataset properties', () => {
    const data = DeadlineDataTestFactory.withSpecificDueSoon('2024-01-20', '1000')

    const { result } = renderHook(() =>
      useDeadlineChartData(data, 30)
    )

    expect(result.current.datasets[0]).toEqual({
      label: 'Factures à échéance',
      data: expect.any(Array),
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      pointRadius: 5,
    })

    expect(result.current.datasets[1]).toEqual({
      label: 'Factures en retard',
      data: expect.any(Array),
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      pointRadius: 4,
    })
  })

  it('memoizes result based on data and selectedDays', () => {
    const data = DeadlineDataTestFactory.withSpecificDueSoon('2024-01-20', '1000')

    const { result, rerender } = renderHook(
      ({ data, selectedDays }) => useDeadlineChartData(data, selectedDays),
      { initialProps: { data, selectedDays: 30 } }
    )

    const firstResult = result.current

    rerender({ data, selectedDays: 30 })
    expect(result.current).toBe(firstResult)

    rerender({ data, selectedDays: 60 })
    expect(result.current).not.toBe(firstResult)
  })

  it('handles multiple invoices with same deadline', () => {
    const data = DeadlineDataTestFactory.create({
      dueSoon: [
        ...DeadlineDataTestFactory.withSpecificDueSoon('2024-01-20', '1000').dueSoon,
        ...DeadlineDataTestFactory.withSpecificDueSoon('2024-01-20', '1500').dueSoon,
      ],
    })

    const { result } = renderHook(() =>
      useDeadlineChartData(data, 30)
    )

    expect(result.current.datasets[0].data).toHaveLength(2)
    expect(result.current.datasets[0].data).toEqual(
      expect.arrayContaining([
        { x: 5, y: 1000 },
        { x: 5, y: 1500 },
      ])
    )
  })
})
