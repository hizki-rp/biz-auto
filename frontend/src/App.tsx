import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import BusinessForm from './pages/BusinessForm'
import SubmissionsList from './pages/SubmissionsList'
import BusinessDetails from './pages/BusinessDetails'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BusinessForm />} />
        <Route path="/submissions" element={<SubmissionsList />} />
        <Route path="/business/:id" element={<BusinessDetails />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
