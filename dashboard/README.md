# Jane Status Dashboard

Real-time status monitoring for Jane agent.

## Features
- Live status: idle / working / error / disconnected
- Current task display with spinner
- Activity statistics (uptime, tasks completed)
- Recent activity log

## Usage
```bash
cd dashboard
npm install
npm run dev
```

Dashboard runs at http://localhost:5173

## API Integration
Jane posts status updates to:
- `POST /api/update` - Update current status
- `GET /api/status` - Get current status
- `GET /api/logs` - Get activity history

Status states:
- `idle` - Waiting for tasks
- `working` - Actively processing
- `error` - Encountered error
- `disconnected` - Cannot reach agent
