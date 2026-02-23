import { useState, useEffect } from 'react'
import './App.css'

interface AgentStatus {
  state: 'idle' | 'working' | 'error' | 'disconnected'
  currentTask: string | null
  lastActivity: string
  uptime: string
}

function App() {
  const [status, setStatus] = useState<AgentStatus>({
    state: 'idle',
    currentTask: null,
    lastActivity: 'Just started',
    uptime: '0m'
  })
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    // Poll status every 5 seconds
    const interval = setInterval(() => {
      fetch('/api/status')
        .then(r => r.json())
        .then(data => setStatus(data))
        .catch(() => setStatus(s => ({ ...s, state: 'disconnected' })))
    }, 5000)

    // Load initial logs
    fetch('/api/logs')
      .then(r => r.json())
      .then(data => setLogs(data.logs || []))

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (status.state) {
      case 'working': return '#4ade80'
      case 'idle': return '#60a5fa'
      case 'error': return '#f87171'
      case 'disconnected': return '#9ca3af'
      default: return '#60a5fa'
    }
  }

  return (
    <div className="dashboard">
      <header>
        <h1>🤖 Jane Status Dashboard</h1>
        <div className="status-badge" style={{ background: getStatusColor() }}>
          {status.state.toUpperCase()}
        </div>
      </header>

      <main>
        <section className="current-task">
          <h2>Current Activity</h2>
          {status.currentTask ? (
            <div className="task-card">
              <div className="spinner"></div>
              <p>{status.currentTask}</p>
            </div>
          ) : (
            <p className="idle-text">Waiting for tasks...</p>
          )}
        </section>

        <section className="stats">
          <div className="stat-card">
            <label>Last Activity</label>
            <value>{status.lastActivity}</value>
          </div>
          <div className="stat-card">
            <label>Uptime</label>
            <value>{status.uptime}</value>
          </div>
          <div className="stat-card">
            <label>Tasks Today</label>
            <value>{logs.length}</value>
          </div>
        </section>

        <section className="logs">
          <h2>Recent Activity</h2>
          <div className="log-list">
            {logs.slice(-20).reverse().map((log, i) => (
              <div key={i} className="log-entry">
                <span className="timestamp">{new Date().toLocaleTimeString()}</span>
                <span className="message">{log}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
