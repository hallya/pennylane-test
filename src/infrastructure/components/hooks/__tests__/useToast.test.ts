import React from 'react'
import { renderHook } from '@testing-library/react'
import { ToastProvider } from '../../ToastProvider'
import { useToast } from '../useToast'

describe('useToast', () => {
  it('throws error when used outside ToastProvider', () => {
    expect(() => {
      renderHook(() => useToast())
    }).toThrow('useToast must be used within a ToastProvider')
  })

  it('returns context when used within ToastProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ToastProvider, null, children)

    const { result } = renderHook(() => useToast(), { wrapper })

    expect(result.current).toBeDefined()
    expect(typeof result.current.showToast).toBe('function')
    expect(typeof result.current.removeToast).toBe('function')
    expect(Array.isArray(result.current.toasts)).toBe(true)
  })

  it('provides toast management functions', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ToastProvider, null, children)

    const { result } = renderHook(() => useToast(), { wrapper })

    expect(() => {
      result.current.showToast('Test message', 'success')
    }).not.toThrow()

    expect(() => {
      result.current.removeToast('test')
    }).not.toThrow()
  })
})