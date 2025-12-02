# Accountant Data Aggregation and Insights Dashboard

## Overview

This project is a full-stack dashboard application for aggregating and displaying financial data from multiple simulated agents. It features real-time data visualization, AI-assisted querying, and comprehensive observability.

## Tech Stack

### Backend
- **Python 3.12+**
- **FastAPI** - Modern, fast API framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - In-memory database for session persistence
- **Faker** - Mock data generation

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Component library
- **React Query** - Data fetching and caching
- **Recharts** - Data visualization
- **Axios** - HTTP client

## Features

✅ **Agent Data Simulation**
- Payments Agent with 30 mock transactions
- Invoices Agent with 30 mock invoices
- Pagination and filtering by status

✅ **Summary Aggregator**
- Total payments and invoices
- Unpaid invoices tracking
- Monthly breakdown visualization

✅ **AI Assistant**
- Keyword-based query processing
- Context-aware responses about financial data
- Chat interface with history

✅ **Observability**
- Activity logging for all API calls
- Real-time log panel
- Error tracking

✅ **Dashboard UI**
- Responsive Material-UI design
- Interactive charts and tables
- Real-time data updates every 10 seconds

## Setup Instructions

### Prerequisites
- Python 3.12+
- Node.js 18+ and npm
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment and install dependencies:
```bash
python3 -m venv venv --without-pip
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
./venv/bin/python get-pip.py
./venv/bin/pip install -r requirements.txt
```

3. Start the backend server:
```bash
./venv/bin/uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Agent Endpoints
- `GET /api/payments?skip=0&limit=10&status=paid` - Fetch paginated payments
- `GET /api/invoices?skip=0&limit=10&status=unpaid` - Fetch paginated invoices

### Aggregation
- `GET /api/summary` - Get financial summary and monthly breakdown

### AI Assistant
- `POST /api/ai-assistant` - Query the AI assistant
  ```json
  { "query": "Show me unpaid invoices" }
  ```

### Observability
- `GET /api/agent-logs?limit=50` - Fetch recent activity logs

## Project Structure

```
accountant-data-aggregation-and-insights-dashboard/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application and routes
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   └── database.py      # Database configuration
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx     # Home page
│   │   │   ├── layout.tsx   # Root layout
│   │   │   └── globals.css  # Global styles
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── SummaryCard.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── Chart.tsx
│   │   │   ├── ChatPanel.tsx
│   │   │   └── LogsPanel.tsx
│   │   ├── lib/
│   │   │   ├── api.ts       # API client
│   │   │   └── utils.ts     # Utilities
│   │   ├── providers/
│   │   │   ├── QueryProvider.tsx
│   │   │   └── ThemeRegistry.tsx
│   │   └── theme/
│   │       └── theme.ts     # MUI theme configuration
│   └── package.json
├── README.md
└── SOLUTION.md
```

## Development Notes

- The backend automatically seeds mock data on startup
- Data persists for the duration of the server session
- The AI assistant uses a simple keyword-based mock implementation
- Frontend auto-refreshes summary data every 10 seconds
- CORS is enabled for local development

## Production Considerations

For production deployment, consider:
- Switch to PostgreSQL or another production database
- Implement proper authentication and authorization
- Use a real LLM API (OpenAI, Anthropic, etc.) for the AI assistant
- Add rate limiting and request validation
- Set up proper CORS policies
- Implement comprehensive error handling
- Add logging and monitoring
- Use environment variables for configuration
- Implement database migrations
- Add unit and integration tests

## License

This project was created as a technical assignment for Adsum.