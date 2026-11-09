# 🚌 BusMitra — Bus Booking Management System

> A full-stack, production-grade bus booking platform built as a placement assessment project for **Algions AI Labs Private Limited**.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📸 Overview

BusMitra is a complete bus booking management system with:
- **Customer portal** — search buses, pick seats, book tickets, cancel bookings
- **Admin dashboard** — manage buses, routes, trips, bookings, users, audit logs
- **Operator portal** — view assigned trips and passenger manifests

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 + Tailwind CSS 3 |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt |
| Testing | Jest + Supertest |
| Icons | Lucide React |
| API Docs | Swagger / OpenAPI 3.0 |

---

## 📁 Project Structure

```
Bus-Booking-Management-System/
├── backend/
│   ├── server.js
│   ├── src/
│   │   ├── config/          # DB connection, Swagger config
│   │   ├── models/          # 7 Mongoose schemas
│   │   ├── routes/          # 10 route files
│   │   ├── controllers/     # 10 controllers
│   │   ├── services/        # Business logic (booking, cancellation, reports)
│   │   ├── middleware/      # auth, authorize, errorHandler, auditLogger
│   │   ├── validators/      # express-validator schemas
│   │   ├── utils/           # PNR generator, response helpers
│   │   ├── seed/            # Demo data seeder
│   │   └── tests/           # Jest + Supertest test suites
├── frontend/
│   ├── src/
│   │   ├── pages/           # All 20+ pages
│   │   │   ├── admin/       # Admin management pages
│   │   │   └── operator/    # Operator views
│   │   ├── components/      # Reusable UI components
│   │   ├── layouts/         # PublicLayout, AdminLayout, OperatorLayout
│   │   ├── context/         # AuthContext (JWT state)
│   │   ├── services/        # Axios API layer
│   │   └── hooks/           # Custom hooks
├── .gitignore
├── .gitattributes
└── README.md
```

---

## 🗄️ Database Design

```
User ──────────── Booking (1:N)
Booking ─────────── SeatAllocation (1:N)   ← partial unique index (trip+seat+confirmed)
Booking ─────────── Passenger (embedded array)
Trip ──────────── SeatAllocation (1:N)
Trip ──────────── Booking (1:N)
Trip ──────────── Bus (N:1)
Trip ──────────── Route (N:1)
Trip ──────────── User[operator] (N:1)
Route ─────────── Stop (source + destination + intermediate stops)
AuditLog ──────── User (N:1)
```

### Key Design Decision: Duplicate-Booking Prevention

`SeatAllocation` has a **compound partial unique index**:
```js
seatAllocationSchema.index(
  { trip: 1, seatNumber: 1 },
  { unique: true, partialFilterExpression: { status: 'confirmed' } }
);
```
This means:
- Two users **can never** confirm the same seat on the same trip at the database level
- Cancelled seats **automatically become available** (status changes to `'cancelled'` — not deleted)
- Historical records are **always preserved**

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free M0 cluster)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/ananya411/Bus-Booking-Management-System.git
cd Bus-Booking-Management-System
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create your `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bus-booking?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

Seed demo data:
```bash
npm run seed -- --force
```

Start the backend:
```bash
npm run dev
```
> Backend runs on **http://localhost:5000**
> Swagger docs at **http://localhost:5000/api/docs**

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
> Frontend runs on **http://localhost:5173**

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@demo.com | Demo@123 |
| **Operator** | operator@demo.com | Demo@123 |
| **Customer** | customer@demo.com | Demo@123 |

---

## 🌐 API Endpoints

| Group | Base Path |
|-------|-----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Trips | `GET /api/trips/search`, `GET /api/trips/:id`, `GET /api/trips/:id/seats` |
| Bookings | `POST /api/bookings`, `GET /api/bookings`, `POST /api/bookings/:id/cancel` |
| Buses | `GET/POST/PUT/DELETE /api/buses` (admin) |
| Routes | `GET/POST/PUT/DELETE /api/routes` (admin) |
| Stops | `GET/POST /api/stops` |
| Operators | `GET /api/operators/trips`, `GET /api/operators/trips/:id/manifest` |
| Reports | `GET /api/reports/dashboard`, `/revenue`, `/occupancy` |
| Audit Logs | `GET /api/audit-logs` (admin) |
| Users | `GET /api/users`, `PUT /api/users/:id/role` (admin) |

> **Full interactive docs:** [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

**8 test cases covering:**
1. ✅ Customer registration
2. ✅ Login (success)
3. ✅ Login with wrong password (rejection)
4. ✅ Protected route without token (rejection)
5. ✅ Valid trip search
6. ✅ Successful seat booking
7. ✅ **Duplicate seat booking rejection** (409 Conflict)
8. ✅ Cancellation and seat release (rebook after cancel)
9. ✅ Unauthorized admin access rejection (403)
10. ✅ Operator access restriction

---

## 💼 Customer Booking Flow

```
Homepage (search form)
    ↓
Search Results (trip cards with filters)
    ↓
Trip Detail (bus info, amenities, boarding/dropping points)
    ↓
Seat Selection (interactive bus layout — available/selected/booked)
    ↓
Passenger Details (name, age, gender per seat + contact info)
    ↓
Booking Confirm (fare summary + simulated payment)
    ↓
E-Ticket (PNR, printable digital ticket)
    ↓
My Bookings (history + cancellation with refund policy)
```

---

## 💰 Cancellation & Refund Policy

| Time Before Departure | Refund |
|----------------------|--------|
| > 24 hours | 80% |
| 12 – 24 hours | 50% |
| < 12 hours | 0% |

Refund status is tracked as `PENDING → PROCESSED`. Cancelled seats are released immediately.

---

## 🔒 Security

- Passwords hashed with **bcrypt** (salt rounds: 12)
- JWT tokens expire in 7 days
- Role-based access enforced **server-side** (not just UI hiding)
- `.env` file is git-ignored — never committed
- Input validated on both frontend and backend (`express-validator`)
- Atomic booking operations prevent race conditions

---

## 🧱 Architecture Notes

- **Modular monolith** — single deployable unit with clear layer separation
- **Services layer** — all business logic in `src/services/`, controllers stay thin
- **Dual-mode booking engine** — uses MongoDB transactions on Atlas (replica set), falls back to atomic operations + rollback on standalone instances
- **Audit logging** — all admin/operator actions logged to `AuditLog` collection

---

## 📝 License

MIT © 2024 Ananya Jaiswal
