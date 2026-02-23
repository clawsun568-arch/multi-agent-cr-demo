// Simple Express server for status API
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

let status = {
  state: 'idle',
  currentTask: null,
  lastActivity: new Date().toISOString(),
  uptime: '0m'
}

let logs = []

app.get('/api/status', (req, res) => res.json(status))
app.get('/api/logs', (req, res) => res.json({ logs }))

// Endpoint to update status from agent
app.post('/api/update', express.json(), (req, res) => {
  status = { ...status, ...req.body }
  if (req.body.currentTask) {
    logs.push(req.body.currentTask)
    status.lastActivity = new Date().toISOString()
  }
  res.json({ ok: true })
})

app.listen(3456, () => console.log('Status API on port 3456'))
