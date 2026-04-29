import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import BusinessForm from './pages/BusinessForm'
import SubmissionsList from './pages/SubmissionsList'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BusinessForm />} />
        <Route path="/submissions" element={<SubmissionsList />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
