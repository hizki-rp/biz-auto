import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'

interface Task {
  id: number
  name: string
  description: string
  frequency: string
  time_spent_hours: number
  is_manual: boolean
  error_rate?: number
}

interface PainPoint {
  id: number
  title: string
  description: string
  severity: string
  cost_impact?: number
}

interface Submission {
  id: number
  workflow_name: string
  tools_used: string[]
  status: string
  created_at: string
  tasks: Task[]
  pain_points: PainPoint[]
}

interface Business {
  id: number
  name: string
  industry: string
  size: string
  location: string
  description: string
  contact_email: string
  contact_phone: string
  created_at: string
  submissions: Submission[]
}

export default function BusinessDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await api.get(`/businesses/list/${id}/`)
        setBusiness(response.data)
      } catch (err: any) {
        console.error('Failed to fetch business:', err)
        setError('Failed to load business details')
      } finally {
        setLoading(false)
      }
    }
    fetchBusiness()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error || 'Business not found'}</div>
          <Link to="/submissions" className="text-blue-600 hover:underline">
            Back to Submissions
          </Link>
        </div>
      </div>
    )
  }

  const totalTasks = business.submissions.reduce((sum, sub) => sum + sub.tasks.length, 0)
  const totalPainPoints = business.submissions.reduce((sum, sub) => sum + sub.pain_points.length, 0)
  const totalTimeWasted = business.submissions.reduce((sum, sub) => 
    sum + sub.tasks.reduce((taskSum, task) => {
      const multiplier = task.frequency === 'daily' ? 5 : 
                        task.frequency === 'weekly' ? 1 : 
                        task.frequency === 'monthly' ? 0.25 : 0.08
      return taskSum + (task.time_spent_hours * multiplier)
    }, 0), 0
  )

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/submissions')}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Back to List
          </button>
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            New Submission
          </Link>
        </div>

        {/* Business Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">{business.name}</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <span className="text-gray-500 text-sm">Industry</span>
              <p className="font-medium capitalize">{business.industry}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Company Size</span>
              <p className="font-medium">{business.size} employees</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Location</span>
              <p className="font-medium">{business.location}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Submitted</span>
              <p className="font-medium">{new Date(business.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {business.description && (
            <div className="mb-4">
              <span className="text-gray-500 text-sm">Description</span>
              <p className="mt-1">{business.description}</p>
            </div>
          )}

          {(business.contact_email || business.contact_phone) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              {business.contact_email && (
                <div>
                  <span className="text-gray-500 text-sm">Email</span>
                  <p className="font-medium">{business.contact_email}</p>
                </div>
              )}
              {business.contact_phone && (
                <div>
                  <span className="text-gray-500 text-sm">Phone</span>
                  <p className="font-medium">{business.contact_phone}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Tasks</h3>
            <p className="text-3xl font-bold mt-2">{totalTasks}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Pain Points</h3>
            <p className="text-3xl font-bold mt-2">{totalPainPoints}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Time Wasted/Week</h3>
            <p className="text-3xl font-bold mt-2">{totalTimeWasted.toFixed(1)}h</p>
          </div>
        </div>

        {/* Submissions */}
        {business.submissions.map((submission) => (
          <div key={submission.id} className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{submission.workflow_name}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Submitted {new Date(submission.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                submission.status === 'completed' ? 'bg-green-100 text-green-800' :
                submission.status === 'analyzing' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {submission.status}
              </span>
            </div>

            {/* Tools Used */}
            {submission.tools_used.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Tools/Software Used</h3>
                <div className="flex flex-wrap gap-2">
                  {submission.tools_used.map((tool, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks */}
            {submission.tasks.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-lg">Repetitive Tasks ({submission.tasks.length})</h3>
                <div className="space-y-3">
                  {submission.tasks.map((task) => {
                    const multiplier = task.frequency === 'daily' ? 5 : 
                                      task.frequency === 'weekly' ? 1 : 
                                      task.frequency === 'monthly' ? 0.25 : 0.08
                    const weeklyHours = task.time_spent_hours * multiplier
                    
                    return (
                      <div key={task.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-lg">{task.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            task.is_manual ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {task.is_manual ? 'Manual' : 'Automated'}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{task.description}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Frequency</span>
                            <p className="font-medium capitalize">{task.frequency}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Time per Task</span>
                            <p className="font-medium">{task.time_spent_hours}h</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Weekly Time</span>
                            <p className="font-medium text-red-600">{weeklyHours.toFixed(1)}h</p>
                          </div>
                          {task.error_rate !== null && task.error_rate !== undefined && (
                            <div>
                              <span className="text-gray-500">Error Rate</span>
                              <p className="font-medium">{task.error_rate}%</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Pain Points */}
            {submission.pain_points.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-lg">Pain Points & Inefficiencies ({submission.pain_points.length})</h3>
                <div className="space-y-3">
                  {submission.pain_points.map((pp) => (
                    <div key={pp.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-lg">{pp.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          pp.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          pp.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          pp.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {pp.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-700">{pp.description}</p>
                      {pp.cost_impact && (
                        <p className="text-sm text-gray-600 mt-2">
                          Estimated Cost Impact: <span className="font-medium">${pp.cost_impact.toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {business.submissions.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No submissions yet for this business.
          </div>
        )}
      </div>
    </div>
  )
}
