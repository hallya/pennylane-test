import React from 'react'
import { Toast, ToastContainer as BootstrapToastContainer } from 'react-bootstrap'
import { Toast as ToastType } from './hooks/useToast'

interface ToastContainerProps {
  toasts: ToastType[]
  onRemove: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <BootstrapToastContainer
      position="top-end"
      className="p-3"
      style={{ zIndex: 9999 }}
    >
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          onClose={() => onRemove(toast.id)}
          delay={5000}
          autohide
          bg={toast.type === 'error' ? 'danger' : toast.type === 'success' ? 'success' : 'info'}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toast.type === 'error' ? 'Erreur' : toast.type === 'success' ? 'Succès' : 'Info'}
            </strong>
          </Toast.Header>
          <Toast.Body className={toast.type === 'error' ? 'text-white' : ''}>
            {toast.message}
          </Toast.Body>
        </Toast>
      ))}
    </BootstrapToastContainer>
  )
}

export default ToastContainer