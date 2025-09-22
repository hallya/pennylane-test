import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { Dashboard, Invoices, CreateInvoiceRHF, EditInvoiceRHF } from '../infrastructure/pages'
import Navigation from '../infrastructure/components/Navigation'
import { ToastProvider } from '../infrastructure/components/ToastProvider'

function App() {
  return (
    <ToastProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/dashboard" Component={Dashboard} />
          <Route path="/invoices" Component={Invoices} />
          <Route path="/invoices/create" Component={CreateInvoiceRHF} />
          <Route path="/invoices/edit/:id" Component={EditInvoiceRHF} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
