import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { Dashboard, Invoices, CreateInvoiceRHF } from '../infrastructure/pages'
import Navigation from '../infrastructure/components/Navigation'

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/invoices" Component={Invoices} />
        <Route path="/invoices/create" Component={CreateInvoiceRHF} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  )
}

export default App
