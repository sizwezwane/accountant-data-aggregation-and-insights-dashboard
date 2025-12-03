# Solution: Accountant Data Aggregation and Insights Dashboard

## Overview

This project is a full-stack application designed to aggregate financial data from simulated agents, provide real-time insights, and offer an AI-assisted query interface. It is built using **FastAPI** for the backend and **Next.js** (React) for the frontend, orchestrated via **Docker**.

## Architecture

### Backend (FastAPI)
*   **API Layer**: RESTful endpoints for data retrieval (`/payments`, `/invoices`), aggregation (`/summary`), and AI interaction (`/ai-assistant`).
*   **Database**: 
    *   **PostgreSQL** (Production/Docker): Used for robust, persistent data storage.
    *   **SQLite** (Development/Fallback): Used for quick local iteration.
    *   **ORM**: SQLAlchemy is used for database abstraction, allowing seamless switching between DB engines.
    *   **Migrations**: Alembic is configured for handling database schema changes and migrations.
*   **Data Simulation**: A seeding script (`seed_data`) populates the database with realistic mock data using the `Faker` library on startup.
*   **Observability**: A custom logging middleware/helper (`log_activity`) tracks key events (agent requests, AI queries) and stores them in the database for the observability widget.

### Frontend (Next.js + Material UI)
*   **Framework**: Next.js 16 (App Router) for server-side rendering and routing.
*   **UI Library**: Material UI (MUI) v6 for a polished, responsive, and accessible interface.
*   **State Management**: **React Query** (TanStack Query) is used for server state management. It handles caching, background refetching (e.g., live summary updates), and loading states.
*   **Visualization**: `Recharts` is used for rendering responsive charts.

### Infrastructure
*   **Docker**: The entire stack (Frontend, Backend, Database) is containerized using Docker Compose for consistent deployment and easy setup.

## Assumptions & Design Decisions

1.  **Mock AI**: 
    *   **Decision**: Instead of integrating a real LLM (which requires API keys and costs), I implemented a keyword-based mock AI.
    *   **Reasoning**: This satisfies the requirement to demonstrate the *workflow* of an AI assistant (receiving query -> processing -> returning context-aware response) without external dependencies. The architecture allows for easy swapping with a real LLM (e.g., OpenAI, Anthropic) by modifying the `ai_assistant` endpoint.

2.  **Data Persistence**:
    *   **Decision**: Data is seeded on every startup if the database is empty.
    *   **Reasoning**: This ensures a consistent testing state. In a real scenario, this would be replaced by a proper ETL pipeline.

3.  **Observability**:
    *   **Decision**: Storing logs in the same relational database.
    *   **Reasoning**: Simple and effective for this scale. For high-scale production, a dedicated logging solution (ELK stack, Datadog) would be preferred.

4.  **Frontend Polling**:
    *   **Decision**: The summary data polls every 10 seconds.
    *   **Reasoning**: Provides "real-time" feel without the complexity of WebSockets for this specific use case.

## Trade-offs

*   **SQLite vs PostgreSQL**: I included support for both. SQLite is great for zero-setup dev, but Postgres is necessary for the requested "production-principled" approach. Docker makes Postgres easy to use, so it's the default.
*   **Client-side Filtering**: The API supports filtering, but for the dashboard tables, I implemented server-side pagination with API-based filtering (via query params) to demonstrate scalable patterns, rather than fetching all data and filtering client-side.

## Video Walkthrough

[Link to Video Recording] (To be added)

## Future Improvements

1.  **Authentication**: Implement JWT-based auth to secure the API.
2.  **Real LLM Integration**: Connect to OpenAI API for true natural language understanding.
3.  **Advanced Filtering**: Add date range pickers and more complex filter logic.
4.  **Unit Tests**: Add Pytest for backend and Jest/React Testing Library for frontend.
