import React, { createContext, useState, ReactNode } from 'react'
import { Toast } from './hooks/useToast'
import ToastContainer from './ToastContainer'

interface ToastContextType {
  toasts: Toast[]
  showToast: (message: string, type: Toast['type']) => void
  removeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: Toast['type'] = 'error') => {
    const id = Date.now().toString()
    const toast: Toast = { id, message, type }
    setToasts(prev => [...prev, toast])

    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}