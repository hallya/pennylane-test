import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Dashboard } from '../infrastructure/pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/" />
      </Routes>
    </Router>
  )
}

export default App
