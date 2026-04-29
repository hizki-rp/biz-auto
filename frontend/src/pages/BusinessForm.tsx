import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

interface Task {
  name: string
  description: string
  frequency: string
  time_spent_hours: number
  is_manual: boolean
}

interface PainPoint {
  title: string
  description: string
  severity: string
}

export default function BusinessForm() {
  const [step, setStep] = useState(1)
  const [businessData, setBusinessData] = useState({
    name: '',
    industry: 'tech',
    size: '1-10',
    location: '',
    description: '',
    contact_email: '',
    contact_phone: '',
  })
  
  const [submissionData, setSubmissionData] = useState({
    workflow_name: '',
    tools_used: [] as string[],
  })
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentTask, setCurrentTask] = useState<Task>({
    name: '',
    description: '',
    frequency: 'daily',
    time_spent_hours: 0,
    is_manual: true,
  })
  
  const [painPoints, setPainPoints] = useState<PainPoint[]>([])
  const [currentPainPoint, setCurrentPainPoint] = useState<PainPoint>({
    title: '',
    description: '',
    severity: 'medium',
  })
  
  const [toolInput, setToolInput] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const addTask = () => {
    if (currentTask.name && currentTask.description) {
      setTasks([...tasks, currentTask])
      setCurrentTask({
        name: '',
        description: '',
        frequency: 'daily',
        time_spent_hours: 0,
        is_manual: true,
      })
    }
  }

  const addPainPoint = () => {
    if (currentPainPoint.title && currentPainPoint.description) {
      setPainPoints([...painPoints, currentPainPoint])
      setCurrentPainPoint({
        title: '',
        description: '',
        severity: 'medium',
      })
    }
  }

  const addTool = () => {
    if (toolInput.trim()) {
      setSubmissionData({
        ...submissionData,
        tools_used: [...submissionData.tools_used, toolInput.trim()]
      })
      setToolInput('')
    }
  }

  const handleSubmit = async () => {
    if (loading) return // Prevent multiple submissions
    
    setLoading(true)
    setError('')
    
    try {
      const businessRes = await api.post('/businesses/list/', businessData)
      const businessId = businessRes.data.id
      
      const submissionRes = await api.post('/businesses/submissions/', {
        business: businessId,
        ...submissionData,
      })
      const submissionId = submissionRes.data.id
      
      for (const task of tasks) {
        await api.post(`/businesses/submissions/${submissionId}/add_task/`, task)
      }
      
      for (const painPoint of painPoints) {
        await api.post(`/businesses/submissions/${submissionId}/add_pain_point/`, painPoint)
      }
      
      setSuccess(true)
      setTimeout(() => navigate('/submissions'), 2000)
    } catch (err: any) {
      console.error('Failed to submit:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to submit form. Please check your connection and try again.'
      setError(errorMessage)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2">Submission Successful!</h2>
          <p className="text-gray-600">Redirecting to submissions list...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:py-12 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-4">Business Problem Discovery</h1>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`flex-1 h-2.5 sm:h-2 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
            ))}
          </div>
          <p className="text-sm sm:text-base text-gray-600 mt-2 font-medium">Step {step} of 4</p>
        </div>

        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-red-800 font-semibold mb-1">Submission Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-red-600 hover:text-red-800 text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          
          {step === 1 && (
            <div className="space-y-5 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Business Profile</h2>
              
              <div>
                <label className="block text-base sm:text-sm font-medium mb-2">Business Name *</label>
                <input
                  type="text"
                  value={businessData.name}
                  onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                  className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-2">Industry *</label>
                  <select
                    value={businessData.industry}
                    onChange={(e) => setBusinessData({ ...businessData, industry: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="tech">Technology</option>
                    <option value="retail">Retail</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-2">Company Size *</label>
                  <select
                    value={businessData.size}
                    onChange={(e) => setBusinessData({ ...businessData, size: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-base sm:text-sm font-medium mb-2">Location *</label>
                <input
                  type="text"
                  value={businessData.location}
                  onChange={(e) => setBusinessData({ ...businessData, location: e.target.value })}
                  className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="City, Country"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={businessData.contact_email}
                    onChange={(e) => setBusinessData({ ...businessData, contact_email: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    value={businessData.contact_phone}
                    onChange={(e) => setBusinessData({ ...businessData, contact_phone: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-base sm:text-sm font-medium mb-2">Description</label>
                <textarea
                  value={businessData.description}
                  onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                  className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={4}
                  placeholder="Tell us about your business..."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Operations Data</h2>
              
              <div>
                <label className="block text-base sm:text-sm font-medium mb-2">Workflow Name *</label>
                <input
                  type="text"
                  value={submissionData.workflow_name}
                  onChange={(e) => setSubmissionData({ ...submissionData, workflow_name: e.target.value })}
                  className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g., Invoice Processing"
                  required
                />
              </div>
              
              <div>
                <label className="block text-base sm:text-sm font-medium mb-2">Tools/Software Currently Used</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                    className="flex-1 px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter tool name"
                  />
                  <button
                    type="button"
                    onClick={addTool}
                    className="px-5 sm:px-4 py-3 sm:py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {submissionData.tools_used.map((tool, idx) => (
                    <span key={idx} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm sm:text-sm flex items-center gap-2">
                      {tool}
                      <button
                        onClick={() => setSubmissionData({
                          ...submissionData,
                          tools_used: submissionData.tools_used.filter((_, i) => i !== idx)
                        })}
                        className="text-blue-600 hover:text-blue-800 text-lg font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Repetitive Tasks</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-2">Task Name *</label>
                  <input
                    type="text"
                    value={currentTask.name}
                    onChange={(e) => setCurrentTask({ ...currentTask, name: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., Data Entry"
                  />
                </div>
                
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={currentTask.description}
                    onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={3}
                    placeholder="Describe what this task involves..."
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base sm:text-sm font-medium mb-2">Frequency *</label>
                    <select
                      value={currentTask.frequency}
                      onChange={(e) => setCurrentTask({ ...currentTask, frequency: e.target.value })}
                      className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-base sm:text-sm font-medium mb-2">Time Spent (hours) *</label>
                    <input
                      type="number"
                      step="0.5"
                      value={currentTask.time_spent_hours}
                      onChange={(e) => setCurrentTask({ ...currentTask, time_spent_hours: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={currentTask.is_manual}
                    onChange={(e) => setCurrentTask({ ...currentTask, is_manual: e.target.checked })}
                    className="w-5 h-5 sm:w-4 sm:h-4"
                  />
                  <label className="text-base sm:text-sm">This is a manual task</label>
                </div>
                
                <button
                  type="button"
                  onClick={addTask}
                  className="w-full py-3 sm:py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add Task
                </button>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-base">Added Tasks ({tasks.length})</h3>
                {tasks.map((task, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-base">{task.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {task.frequency} • {task.time_spent_hours}h • {task.is_manual ? 'Manual' : 'Automated'}
                        </p>
                      </div>
                      <button
                        onClick={() => setTasks(tasks.filter((_, i) => i !== idx))}
                        className="text-red-600 hover:text-red-800 text-base font-medium px-2 py-1 min-w-[70px]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Pain Points & Inefficiencies</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-2">Pain Point Title *</label>
                  <input
                    type="text"
                    value={currentPainPoint.title}
                    onChange={(e) => setCurrentPainPoint({ ...currentPainPoint, title: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., Slow approval process"
                  />
                </div>
                
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={currentPainPoint.description}
                    onChange={(e) => setCurrentPainPoint({ ...currentPainPoint, description: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={3}
                    placeholder="Describe the problem and its impact..."
                  />
                </div>
                
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-2">Severity *</label>
                  <select
                    value={currentPainPoint.severity}
                    onChange={(e) => setCurrentPainPoint({ ...currentPainPoint, severity: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <button
                  type="button"
                  onClick={addPainPoint}
                  className="w-full py-3 sm:py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add Pain Point
                </button>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-base">Added Pain Points ({painPoints.length})</h3>
                {painPoints.map((pp, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-base">{pp.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{pp.description}</p>
                        <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${
                          pp.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          pp.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          pp.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {pp.severity}
                        </span>
                      </div>
                      <button
                        onClick={() => setPainPoints(painPoints.filter((_, i) => i !== idx))}
                        className="text-red-600 hover:text-red-800 text-base font-medium px-2 py-1 min-w-[70px]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 sm:mt-8 pt-6 border-t">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="w-full sm:w-auto px-6 py-3 sm:py-2 text-base border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium order-2 sm:order-1"
            >
              Previous
            </button>
            
            {step < 4 ? (
              <button
                onClick={() => {
                  if (step === 1 && (!businessData.name || !businessData.location)) {
                    alert('Please fill in required fields')
                    return
                  }
                  if (step === 2 && !submissionData.workflow_name) {
                    alert('Please enter a workflow name')
                    return
                  }
                  setStep(step + 1)
                }}
                className="w-full sm:w-auto px-6 py-3 sm:py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium order-1 sm:order-2"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 sm:py-2 text-base bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
