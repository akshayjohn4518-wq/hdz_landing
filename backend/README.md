# HDZ Operations Backend Service

Production-grade Node.js + TypeScript REST API backend for the Day Zero Landing platform and Operations Admin CMS, powered by Supabase PostgreSQL.

## Features
- **Supabase PostgreSQL Connectivity**: Automated connection pooling with SSL and IPv4/IPv6 compatibility.
- **SQL Migrations System**: Automated SQL migration runner (`npm run migrate`) with tracking in `_migrations`.
- **Pre-seeded Schemas**: Pre-configured tables for products, missions, contacts/inquiries, build logs, chapters, media assets, team, system activities, and site settings.
- **RESTful Endpoints**:
  - `GET /api/health` — System status, uptime, and database latency.
  - `POST /api/auth/login` — Operator authentication.
  - `GET /api/dashboard/stats` — Operations metrics (products, inquiries, missions, site health).
  - `GET /api/dashboard/activities` — Real-time system activity feed.
  - `GET /api/products` & CRUD — Manage products catalogue.
  - `GET /api/missions` & CRUD — Mission milestones and telemetry.
  - `POST /api/contacts` & CRUD — Public contact dispatches and admin inquiries review.
  - `GET /api/build-logs` — Changelogs and release logs.
  - `GET /api/chapters` — Content chapters.
  - `GET /api/team` — Organization team members.
  - `GET /api/media` — Media assets registry.
  - `GET /api/settings` — System settings.

## Getting Started

### 1. Installation
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create or update `.env`:
```env
PORT=5000
NODE_ENV=development

# Supabase PostgreSQL Pooler
DATABASE_URL=postgresql://postgres.ugfakpgidusihiodromy:Akshay%4012345678920@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres

DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.ugfakpgidusihiodromy
DB_PASSWORD=Akshay@12345678920
DB_SSL=true

SUPABASE_URL=https://ugfakpgidusihiodromy.supabase.co
SUPABASE_ANON_KEY=sb_publishable_jtxEcYU2HoEDE1YuS408-g_uq4XY-uM

CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 3. Database Migrations
Run the database migrations against Supabase:
```bash
npm run migrate
```
To re-seed sample data:
```bash
npm run seed
```

### 4. Running the Server
Development with hot reload:
```bash
npm run dev
```

Production build and start:
```bash
npm run build
npm start
```
