import { renderHook, act } from '@testing-library/react'
import { useDebouncedSearch } from '../useDebouncedSearch'

describe('useDebouncedSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('initializes with empty query and not searching', () => {
    const mockSearchFunction = vi.fn()
    const { result } = renderHook(() =>
      useDebouncedSearch(mockSearchFunction, 2, 300)
    )

    expect(result.current.query).toBe('')
    expect(result.current.isSearching).toBe(false)
  })

  it('updates query immediately', () => {
    const mockSearchFunction = vi.fn()
    const { result } = renderHook(() =>
      useDebouncedSearch(mockSearchFunction, 2, 300)
    )

    act(() => {
      result.current.updateQuery('test')
    })

    expect(result.current.query).toBe('test')
  })

  it('does not call search function when query is below min length', () => {
    const mockSearchFunction = vi.fn()
    const { result } = renderHook(() =>
      useDebouncedSearch(mockSearchFunction, 3, 300)
    )

    act(() => {
      result.current.updateQuery('ab')
    })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockSearchFunction).not.toHaveBeenCalled()
    expect(result.current.isSearching).toBe(false)
  })

  it('calls search function after debounce delay when query meets min length', async () => {
    const mockSearchFunction = vi.fn().mockReturnValue(undefined)
    const { result } = renderHook(() =>
      useDebouncedSearch(mockSearchFunction, 2, 300)
    )

    act(() => {
      result.current.updateQuery('test')
    })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockSearchFunction).toHaveBeenCalledWith('test')
    expect(result.current.isSearching).toBe(false)
  })

  it('sets isSearching to true during search', async () => {
    const mockSearchFunction = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )
    const { result } = renderHook(() =>
      useDebouncedSearch(mockSearchFunction, 2, 300)
    )

    act(() => {
      result.current.updateQuery('test')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current.isSearching).toBe(true)
  })

  it('cancels previous search when query changes before debounce completes', () => {
    const mockSearchFunction = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() =>
      useDebouncedSearch(mockSearchFunction, 2, 300)
    )

    act(() => {
      result.current.updateQuery('first')
    })

    act(() => {
      vi.advanceTimersByTime(150)
    })

    act(() => {
      result.current.updateQuery('second')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockSearchFunction).toHaveBeenCalledTimes(1)
    expect(mockSearchFunction).toHaveBeenCalledWith('second')
  })

  it('does not search for duplicate queries', () => {
    const mockSearchFunction = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() =>
      useDebouncedSearch(mockSearchFunction, 2, 300)
    )

    act(() => {
      result.current.updateQuery('test')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    act(() => {
      result.current.updateQuery('test')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockSearchFunction).toHaveBeenCalledTimes(1)
  })

  it('resets search state with resetSearch', () => {
    const mockSearchFunction = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() =>
      useDebouncedSearch(mockSearchFunction, 2, 300)
    )

    act(() => {
      result.current.updateQuery('test')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    act(() => {
      result.current.resetSearch()
    })

    expect(result.current.query).toBe('')
    expect(result.current.isSearching).toBe(false)
  })

  it('handles search function errors gracefully', async () => {
    const mockSearchFunction = vi
      .fn()
      .mockImplementation(() => { throw new Error('Search failed') })
    const { result } = renderHook(() =>
      useDebouncedSearch(mockSearchFunction, 2, 300)
    )

    act(() => {
      result.current.updateQuery('test')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockSearchFunction).toHaveBeenCalledWith('test')
    expect(result.current.isSearching).toBe(false)
  })

  it('uses default minLength and debounceMs from constants', async () => {
    const mockSearchFunction = vi.fn().mockReturnValue(undefined)
    const { result } = renderHook(() =>
      useDebouncedSearch(mockSearchFunction)
    )

    act(() => {
      result.current.updateQuery('test')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockSearchFunction).toHaveBeenCalledWith('test')
    expect(result.current.isSearching).toBe(false)
  })
})
