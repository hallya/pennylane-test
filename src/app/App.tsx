import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Dashboard } from '../infrastructure/pages'

function App() {
  return (
    <div className="px-5">
      <Router>
        <Routes>
          <Route path="/dashboard" Component={Dashboard} />
          <Route path="/" />
        </Routes>
      </Router>
    </div>
  )
}

export default App
