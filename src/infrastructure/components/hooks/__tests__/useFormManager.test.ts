import { renderHook, act } from '@testing-library/react'
import { useFormManager } from '../useFormManager'

describe('useFormManager', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes with default values and mode', () => {
    const onSubmit = vi.fn()
    const initialValues = { name: 'test', age: 25 }

    const { result } = renderHook(() =>
      useFormManager({ onSubmit, initialValues })
    )

    expect(result.current.form.getValues()).toEqual(initialValues)
  })

  it('uses onChange mode by default', () => {
    const onSubmit = vi.fn()

    const { result } = renderHook(() => useFormManager({ onSubmit }))

    expect(result.current.form.control._options.mode).toBe('onChange')
  })

  it('respects custom validation mode', () => {
    const onSubmit = vi.fn()

    const { result } = renderHook(() =>
      useFormManager({ onSubmit, mode: 'onBlur' })
    )

    expect(result.current.form.control._options.mode).toBe('onBlur')
  })

  it('calls onSubmit successfully', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useFormManager({ onSubmit }))

    const testData = { name: 'John', email: 'john@test.com' }

    await act(async () => {
      result.current.form.setValue('name', 'John')
      result.current.form.setValue('email', 'john@test.com')
      await result.current.form.handleSubmit(result.current.handleSubmit)()
    })

    expect(onSubmit).toHaveBeenCalledWith(testData)
    expect(console.error).not.toHaveBeenCalled()
    expect(window.alert).not.toHaveBeenCalled()
  })

  it('handles onSubmit rejection with error logging and alert', async () => {
    const error = new Error('Submit failed')
    const onSubmit = vi.fn().mockRejectedValue(error)
    const { result } = renderHook(() => useFormManager({ onSubmit }))

    await act(async () => {
      result.current.form.setValue('name', 'John')
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(onSubmit).toHaveBeenCalledWith({ name: 'John' })
    expect(console.error).toHaveBeenCalledWith('Form submission error:', error)
    expect(window.alert).toHaveBeenCalledWith(
      'Une erreur est survenue lors de la soumission'
    )
  })

  it('handles onSubmit throwing synchronously', async () => {
    const error = new Error('Sync error')
    const onSubmit = vi.fn().mockImplementation(() => {
      throw error
    })
    const { result } = renderHook(() => useFormManager({ onSubmit }))

    await act(async () => {
      result.current.form.setValue('name', 'John')
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(onSubmit).toHaveBeenCalledWith({ name: 'John' })
    expect(console.error).toHaveBeenCalledWith('Form submission error:', error)
    expect(window.alert).toHaveBeenCalledWith(
      'Une erreur est survenue lors de la soumission'
    )
  })

  it('works with different data types', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() =>
      useFormManager<Record<string, unknown>>({ onSubmit })
    )

    const testData = { items: [1, 2, 3] }

    await act(async () => {
      result.current.form.setValue('items', [1, 2, 3])
      await result.current.form.handleSubmit(async (data) => {
        await onSubmit(data)
      })()
    })

    expect(onSubmit).toHaveBeenCalledWith(testData)
  })

  it('provides access to form methods', () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useFormManager({ onSubmit }))

    expect(result.current.form.setValue).toBeDefined()
    expect(result.current.form.getValues).toBeDefined()
    expect(result.current.form.watch).toBeDefined()
    expect(result.current.form.handleSubmit).toBeDefined()
  })

  it('uses empty object as default initial values', () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useFormManager({ onSubmit }))

    expect(result.current.form.getValues()).toEqual({})
  })

  it('integrates with react-hook-form validation', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() =>
      useFormManager({
        onSubmit,
        initialValues: { email: '' },
        mode: 'onSubmit',
      })
    )

    act(() => {
      result.current.form.setValue('email', 'test@example.com')
    })

    await act(async () => {
      await result.current.form.handleSubmit(result.current.handleSubmit)()
    })

    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
  })
})
