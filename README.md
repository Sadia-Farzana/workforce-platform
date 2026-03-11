# Workforce Management Platform

![CI](https://github.com/Sadia-Farzana/workforce-platform/actions/workflows/ci.yml/badge.svg)

A full-stack distributed workforce management system built with ASP.NET Core 10, React, PostgreSQL, MongoDB, and RabbitMQ. Fully containerised — runs with a single command.

---

## Quick Start

```bash
git clone https://github.com/Sadia-Farzana/workforce-platform.git
cd workforce-platform
docker compose up --build
```

| Service | URL |
|---|---|
| API (Scalar Docs) | https://localhost:7192/scalar |
| Frontend | http://localhost:3000 |
| RabbitMQ Management | http://localhost:15672 (wfp / wfp_secret) |
| Health Check | http://localhost:5270/health |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│              React + TypeScript + Vite + shadcn/ui               │
│                         Port :3000                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST JSON
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│                  ASP.NET Core 10 Web API                         │
│         Clean Architecture · JWE Auth · Scalar Docs             │
│                      Port :8080 / :7192                          │
│                                                                  │
│  /api/v1/auth          /api/v1/employees                        │
│  /api/v1/projects      /api/v1/leave-requests                   │
│  /api/v1/audit-logs    /api/v1/dashboard                        │
└──────┬──────────────────────────────────┬───────────────────────┘
       │ EF Core / Npgsql                 │ MongoDB Driver
       ▼                                  ▼
┌──────────────────┐           ┌──────────────────────┐
│  PostgreSQL 16   │           │     MongoDB 7        │
│  Port :5432      │           │     Port :27017      │
│                  │           │                      │
│  employees       │           │  leave_requests      │
│  departments     │           │  audit_logs          │
│  designations    │           │  summary_reports     │
│  projects        │           └──────────────────────┘
│  project_members │
│  tasks           │
│  users           │
│  refresh_tokens  │
└──────────────────┘
       │
       │ MassTransit (Publish)
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RabbitMQ 3.13                               │
│                  AMQP :5672 · UI :15672                          │
│  Domain Events: EmployeeCreated · EmployeeUpdated · Deleted     │
│  ProjectCreated · ProjectUpdated · TaskStatusChanged            │
│  LeaveRequestSubmitted · LeaveStatusChanged                     │
└───────┬─────────────────────────────┬───────────────────────────┘
        │ Subscribe (MassTransit)      │ Subscribe (amqplib)
        ▼                             ▼
┌───────────────────┐       ┌─────────────────────────┐
│   Audit Worker    │       │     Report Worker        │
│   .NET 10         │       │     Node.js 22 + TS      │
│                   │       │                          │
│  11 consumers     │       │  Scheduled every 5 min  │
│  One per event    │       │  Aggregates PostgreSQL   │
│  Idempotent save  │       │  + MongoDB stats         │
│  Retry (3x)       │       │  Saves SummaryReport     │
│  Writes audit_logs│       │  to MongoDB              │
└───────────────────┘       └─────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| API | ASP.NET Core 10 | REST API, Clean Architecture |
| ORM | EF Core 10 + Npgsql | PostgreSQL data access |
| SQL DB | PostgreSQL 16 | Employees, projects, tasks, auth |
| NoSQL DB | MongoDB 7 | Leave requests, audit logs, reports |
| Message Broker | RabbitMQ 3.13 | Domain event publishing |
| Auth | JWE (encrypted JWT) + PasswordHasher | Secure token auth |
| API Docs | Scalar + OpenAPI | Interactive API documentation |
| Logging | Serilog (console + file) | Structured daily log files |
| Worker 1 | .NET 10 Worker Service | Audit log consumer |
| Worker 2 | Node.js 22 + TypeScript | Report aggregator |
| Frontend | React + TypeScript + Vite | SPA with shadcn/ui |
| Container | Docker + Docker Compose | Full stack orchestration |
| CI/CD | GitHub Actions | Build, lint, test on push |

---

## Project Structure

```
workforce-platform/
├── apps/
│   ├── api/WorkforceAPI/               # ASP.NET Core 10 API
│   │   ├── src/
│   │   │   ├── Domain/                 # Entities, enums, events
│   │   │   ├── Application/            # Services, interfaces, DTOs
│   │   │   └── Infrastructure/         # EF Core, MongoDB, RabbitMQ, Auth
│   │   └── API/
│   │       ├── Controllers/            # Zero-logic controllers
│   │       └── Middleware/             # GlobalExceptionMiddleware, JwtMiddleware
│   │
│   ├── worker-dotnet/AuditWorker/      # .NET 10 Worker Service
│   │   ├── Domain/                     # AuditLog document, DomainEvents
│   │   ├── Infrastructure/             # MongoDB, consumers, repository
│   │   └── Worker/                     # BackgroundService heartbeat
│   │
│   ├── worker-node/                    # Node.js 22 Report Worker
│   │   └── src/
│   │       ├── index.ts                # Entry point
│   │       ├── scheduler.ts            # Interval runner
│   │       ├── aggregator.ts           # Queries PG + Mongo, saves report
│   │       └── rabbitmq.ts             # Event-triggered re-aggregation
│   │
│   └── frontend/                       # React + TypeScript + Vite
│       └── src/
│           ├── pages/                  # Dashboard, Employees, Projects, Leave
│           └── components/             # shadcn/ui components
│
├── docker-compose.yml                  # Full stack orchestration
├── .env.example                        # Environment variable template
├── .github/workflows/ci.yml            # GitHub Actions CI/CD
├── README.md
└── AI-WORKFLOW.md
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Public | Login — returns JWE access token + refresh token |
| POST | `/api/v1/auth/register` | Public | Register a new user account |
| POST | `/api/v1/auth/refresh` | Public | Exchange refresh token for new access token |
| POST | `/api/v1/auth/logout` | Bearer | Revoke refresh token |
| POST | `/api/v1/auth/change-password` | Bearer | Change password |
| GET | `/api/v1/auth/me` | Bearer | Get current user info |

### Employees
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/v1/employees` | All | Paginated list with search + filter |
| GET | `/api/v1/employees/{id}` | All | Employee detail with projects + leave history |
| GET | `/api/v1/employees/search?q=` | All | Full-text search |
| POST | `/api/v1/employees` | HR/Admin | Create employee |
| PUT | `/api/v1/employees/{id}` | HR/Admin | Update employee |
| DELETE | `/api/v1/employees/{id}` | Admin | Soft delete |

### Projects & Tasks
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/v1/projects` | All | Paginated projects list |
| GET | `/api/v1/projects/{id}` | All | Project detail with members + kanban tasks |
| POST | `/api/v1/projects` | Manager+ | Create project |
| PUT | `/api/v1/projects/{id}` | Manager+ | Update project |
| POST | `/api/v1/projects/{id}/members` | Manager+ | Add team member |
| DELETE | `/api/v1/projects/{id}/members/{empId}` | Manager+ | Remove member |
| GET | `/api/v1/projects/{id}/tasks` | All | Tasks for project |
| POST | `/api/v1/projects/{id}/tasks` | Manager+ | Create task |
| PUT | `/api/v1/projects/{id}/tasks/{taskId}` | Manager+ | Update task |

### Leave Requests
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/v1/leave-requests` | All | Paginated leave list with filters |
| GET | `/api/v1/leave-requests/{id}` | All | Leave detail with approval history |
| POST | `/api/v1/leave-requests` | All | Submit leave request |
| PATCH | `/api/v1/leave-requests/{id}/review` | Manager+ | Approve or reject |

### Audit Logs & Dashboard
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/v1/audit-logs` | HR/Admin | Paginated audit log browser |
| GET | `/api/v1/audit-logs/entity/{type}/{id}` | HR/Admin | Audit trail for specific entity |
| GET | `/api/v1/dashboard` | All | Headcount, project stats, leave analytics |

---

## Authentication Flow

```
POST /api/v1/auth/login
  { "email": "admin@workforce.com", "password": "Admin@123" }

Response:
  {
    "accessToken": "<JWE encrypted token>",
    "refreshToken": "<opaque 64-byte token>",
    "expiresAt": "2026-03-08T08:00:00Z",
    "tokenType": "Bearer",
    "user": { "id": 1, "username": "admin", "role": "Admin" }
  }

All protected requests:
  Authorization: Bearer <accessToken>
```

Tokens use **JWE (JSON Web Encryption)** — the payload is AES-256 encrypted so clients cannot read claims. Refresh tokens are stored in PostgreSQL and rotated on every use (one-time use). Password changes revoke all active sessions.

---

## Role Permissions

| Action | Employee | Manager | HR | Admin |
|---|:-:|:-:|:-:|:-:|
| View employees / projects / tasks | ✅ | ✅ | ✅ | ✅ |
| Create / edit employees | ❌ | ❌ | ✅ | ✅ |
| Delete employees | ❌ | ❌ | ❌ | ✅ |
| Create / update projects & tasks | ❌ | ✅ | ✅ | ✅ |
| Submit leave request | ✅ | ✅ | ✅ | ✅ |
| Approve / reject leave | ❌ | ✅ | ✅ | ✅ |
| View audit logs | ❌ | ❌ | ✅ | ✅ |

---

## Seed Data

The API auto-seeds on first run:

| Data | Count |
|---|---|
| Departments | 10 |
| Designations | 15 |
| Employees | 60 |
| Projects | 8 |
| Tasks | ~60 (5–12 per project) |
| Leave Requests | ~100+ (MongoDB) |

Default admin login:
```
Email:    admin@workforce.com
Password: Admin@123
```

---

## Background Workers

### Audit Worker (.NET 10)
Listens to all domain events via RabbitMQ and writes immutable audit log entries to MongoDB.

- 11 consumers covering all entity lifecycle events
- Idempotent — duplicate events are detected and skipped via `EventId`
- Retry policy: 3 retries at 5s / 15s / 30s intervals before dead-lettering
- Runs as a .NET Worker Service (`BackgroundService`)

### Report Worker (Node.js 22 + TypeScript)
Aggregates workforce statistics from both databases on a schedule.

- Runs every 5 minutes by default (configurable via `REPORT_INTERVAL_MS`)
- Also triggered on domain events (employee / project / leave changes)
- Saves daily `summary_report` to MongoDB with headcount, project stats, leave breakdown
- Connects to PostgreSQL, MongoDB, and RabbitMQ independently

---

## Environment Variables

Copy `.env.example` to `.env` before running locally:

```bash
cp .env.example .env
```

Key variables:

```env
POSTGRES_USER=wfp
POSTGRES_PASSWORD=wfp_secret
POSTGRES_DB=workforce

MONGO_USER=wfp
MONGO_PASSWORD=wfp_secret

RABBITMQ_USER=wfp
RABBITMQ_PASSWORD=wfp_secret

JWT_SECRET=your-32+-character-signing-secret
JWT_ENCRYPTION_SECRET=your-32+-character-encryption-secret
```

---

## Running Locally (Without Docker)

**Prerequisites:** .NET 10 SDK, Node.js 22, Docker (for databases only)

```bash
# 1. Start databases
docker compose up postgres mongo rabbitmq -d

# 2. Run API
cd apps/api/WorkforceAPI/WorkforceAPI
set ASPNETCORE_ENVIRONMENT=Development
dotnet run

# 3. Run Audit Worker
cd apps/worker-dotnet/AuditWorker
dotnet run

# 4. Run Report Worker
cd apps/worker-node
npm install
npm run dev

# 5. Run Frontend
cd apps/frontend
npm install
npm run dev
```

---

## CI/CD Pipeline

GitHub Actions runs on every push and pull request to `main`:

1. **Build** — `dotnet build` for API and both .NET workers
2. **Lint** — TypeScript checks for Node worker and frontend
3. **Docker** — `docker compose build` verifies all containers build successfully

The badge at the top of this README reflects the latest pipeline status.

---

## Bonus Features Implemented

| Feature | Status | Details |
|---|---|---|
| API Documentation (Scalar) | ✅ | Interactive docs at `/scalar`, spec at `/openapi/v1.json` |
| Audit Log Browser | ✅ | Paginated, filterable by entity type, date, actor |
| JWE Token Encryption | ✅ | Access tokens are AES-256 encrypted — payload unreadable by client |
| Health Checks | ✅ | `/health` and `/health/detail` with per-service status |
| File Logging | ✅ | Serilog daily rolling logs to `logs/workforce-YYYYMMDD.log` |
| Token Rotation | ✅ | Refresh tokens are one-time use, rotated on every refresh |
| Idempotent Workers | ✅ | Audit worker deduplicates events by `EventId` |
| Global Exception Middleware | ✅ | Unified error shape across all endpoints |

---

## Known Limitations

- **Frontend API integration** is scaffolded but not fully connected to the backend due to time constraints. The API is fully functional and tested via Scalar. All UI pages and routing are in place.
- RabbitMQ virtual host `workforce` must exist or the connection falls back to `/`.

---

## Development Notes

- `appsettings.json` — production / Docker config (`Host=postgres`)
- `appsettings.Development.json` — local dev config (`Host=localhost`)
- Always run locally with: `dotnet run --environment Development`
- EF Core migrations are committed and auto-applied on startup
- MongoDB collections are created automatically on first write# Workforce Management Platform

![CI/CD](https://github.com/Sadia-Farzana/workforce-platform/actions/workflows/ci.yml/badge.svg)
```

---

## How it works
```
Push to main
    ↓
Jobs 1, 2, 3 run in PARALLEL
    ├── dotnet build API
    ├── dotnet build AuditWorker
    └── npm run build Node Worker
         ↓ (all three must pass)
Job 4 — Docker Build & Push
    ├── builds API image    → ghcr.io/you/workforce-platform-api:latest
    ├── builds AuditWorker  → ghcr.io/you/workforce-platform-audit-worker:latest
    ├── builds Node Worker  → ghcr.io/you/workforce-platform-report-worker:latest
    └── builds Frontend     → ghcr.io/you/workforce-platform-frontend:latest
