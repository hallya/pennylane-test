import { useContext } from 'react'
import { ToastContext } from '../ToastProvider'

export interface Toast {
  id: string
  message: string
  type: 'error' | 'success' | 'info' | 'warning'
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}