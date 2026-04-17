# FreshNest — Post-Harvest Storage & Logistics Management System

A full-stack web application for managing post-harvest storage conditions and logistics for farmers, transporters, and dealers in Bangladesh.

## Tech Stack

- **Frontend:** React js , Tailwind cs , Javascript
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Authentication:** JWT + bcrypt

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+

### Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
cp backend/.env.example backend/.env
# Edit .env with your database credentials and JWT secret
```

3. **Start the server:**
```bash
npm run dev
```

4. **Open the app:**
- Frontend: http://localhost:5500 (or open frontend/index.html)
- API: http://localhost:5000

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@harvest.bd | admin123 |
| Farmer | rahim@farm.bd | pass123 |
| Transport | karim@trans.bd | pass123 |
| Dealer | dhaka@fresh.bd | pass123 |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login

### Produce
- `GET /api/produce` — List produce
- `POST /api/produce` — Add produce (farmer)
- `DELETE /api/produce/:id` — Remove produce
- `PATCH /api/produce/:id/status` — Update status

### Transport
- `GET /api/transport` — List transport requests
- `POST /api/transport` — Create request (farmer)
- `PATCH /api/transport/:id` — Update status

### Deals
- `GET /api/deals` — List deals
- `POST /api/deals` — Create deal (dealer)
- `PATCH /api/deals/:id` — Respond to deal (farmer)

### Failures
- `GET /api/failures` — List failures
- `POST /api/failures` — Report failure (transport)

## Project Structure

```
FreshNest/
├── backend/
│   ├── server.js       # Main API server
│   ├── db_init.js     # Database initialization
│   ├── .env           # Environment config
│   └── package.json
├── frontend/
│   ├── index.html     # Main HTML
│   ├── script.js     # Frontend JavaScript
│   └── style.css     # Styles
├── database/
│   ├── database.sql  # Schema & seed data
│   └── root.env      # Template env
└── README.md
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| DB_HOST | Database host | localhost |
| DB_USER | Database user | root |
| DB_PASSWORD | Database password | - |
| DB_NAME | Database name | freshnest_db |
| JWT_SECRET | JWT signing secret | - |
| NODE_ENV | Production/development | development |
| CLIENT_ORIGIN | Allowed CORS origin | - |

## Security Notes

1. Change `JWT_SECRET` to a strong, unique value in production
2. Never commit `.env` files with real credentials
3. Use `.gitignore` to exclude sensitive files
4. The app validates JWT tokens on every protected route
5. Passwords are hashed with bcrypt (12 rounds)

## License

MIT
