# 🚌 BusMitra — Complete Project Development Journey & Task Record
> **Algions AI Labs Private Limited | Full-Stack Web Development Internship Assessment**  
> **Project Title:** Bus Booking Management System  
> **Domain:** Transport & Fleet Booking Platform  
> **Architecture:** Production-Grade Modular Monolith (Node.js/Express + React 18/Vite + MongoDB Atlas)  
> **Document Status:** Comprehensive Final Record (From Project Inception to Production Delivery)  

---

## 📌 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Inception & Core Objectives](#2-project-inception--core-objectives)
3. [Technology Stack & Tooling Inventory](#3-technology-stack--tooling-inventory)
4. [Complete Chronological Development Journey](#4-complete-chronological-development-journey)
   - [Phase 1: Project Initialization & Architectural Scaffolding](#phase-1-project-initialization--architectural-scaffolding)
   - [Phase 2: Database Schema Engineering & Data Modeling](#phase-2-database-schema-engineering--data-modeling)
   - [Phase 3: Backend RESTful API & Core Business Services](#phase-3-backend-restful-api--core-business-services)
   - [Phase 4: Frontend Architecture & User Journey Workflows](#phase-4-frontend-architecture--user-journey-workflows)
   - [Phase 5: Brand Identity & UI/UX Re-Engineering (Electric Lime & Noir)](#phase-5-brand-identity--uiux-re-engineering-electric-lime--noir)
   - [Phase 6: Critical Bug Fixes, React Optimization & Defect Resolutions](#phase-6-critical-bug-fixes-react-optimization--defect-resolutions)
   - [Phase 7: Real-World Dynamic Pricing & Inter-City Distance Engine](#phase-7-real-world-dynamic-pricing--inter-city-distance-engine)
   - [Phase 8: Assessment Rubric Audit & Final Feature Completion](#phase-8-assessment-rubric-audit--final-feature-completion)
   - [Phase 9: Operator Bus Fleet Management & Route Scheduling](#phase-9-operator-bus-fleet-management--route-scheduling)
5. [Complete Inventory of Every File in the System](#5-complete-inventory-of-every-file-in-the-system)
6. [Deep-Dive Problem Solving & Debugging Log](#6-deep-dive-problem-solving--debugging-log)
7. [Concurrency, Double-Booking & Atomic Transactions](#7-concurrency-double-booking--atomic-transactions)
8. [Configurable Cancellation & Refund Rules Engine](#8-configurable-cancellation--refund-rules-engine)
9. [Acceptance Criteria Demonstration & Verification Matrix](#9-acceptance-criteria-demonstration--verification-matrix)
10. [Final Evaluation & Submission Readiness](#10-final-evaluation--submission-readiness)

---

## 1. Executive Summary

This document captures the exhaustive, end-to-end development record of **BusMitra (Bus Booking Management System)**. Built as an advanced individual placement assessment for **Algions AI Labs Private Limited**, the system represents a fully responsive, enterprise-grade, database-backed business application supporting three core operational user roles:
- **Passengers / Customers:** Seamless trip search across real-world Indian inter-city corridors, live seat deck layout selection, multi-passenger booking with instant unique PNR issuance, digital PDF/printable boarding passes, and time-bracketed ticket cancellations with automated refund calculation.
- **Fleet Operators:** Dedicated operational workspace to track assigned bus routes, review real-time fleet occupancy progress, reconcile passenger boarding manifests, and monitor trip schedules.
- **System Administrators:** Executive governance suite with end-to-end management over bus fleets, transit hubs/stops, route corridors, trip schedules, fares, customer/operator user roles, and an immutable security audit log.

Every feature was designed from the ground up to satisfy the 5 strict acceptance criteria, 100-mark evaluation rubric, and production reliability standards required by Algions AI Labs.

---

## 2. Project Inception & Core Objectives

### The Assignment Mandate
The candidate was assigned the **Bus Booking Management System** domain with explicit guidelines:
1. **Operator & Route Setup:** Manage bus operators, vehicles, seat layouts (2×2, 2×1, sleeper/seater), routes, transit stops, trip schedules, and base fares.
2. **Trip Search:** Search by origin, destination, and travel date; show boarding/dropping points, departure/arrival schedules, journey durations, distance, and available seat counters.
3. **Passenger & Seat Booking:** Capture passenger details (name, age, gender, seat allocation), select seats interactively, and create bookings with unique PNR tickets.
4. **Seat Integrity (Core Challenge):** Prevent duplicate confirmed bookings for the same trip seat under high concurrency and simultaneous requests.
5. **Cancellation & Ticketing:** Implement configurable cancellation rules and simulated refund status; preserve booking history and passenger manifests while making cancelled seats immediately rebookable.
6. **Operator Reporting:** Provide route schedules, seat occupancy reconciliation, passenger manifests, and booking summaries.
7. **Production & Submission Standards:** Clean architectural separation (modular monolith), server-side RBAC, Swagger/OpenAPI 3.0 documentation, automated Jest/Supertest suites covering conflict cases, `.env.example` templates, and a detailed Technical Report with a 3–5 minute video walkthrough script.

---

## 3. Technology Stack & Tooling Inventory

The application was built without paid third-party dependencies using modern, production-standard technologies:

### 3.1 Backend Stack
| Technology / Package | Version | Purpose in Project |
| :--- | :--- | :--- |
| **Node.js** | `v18.x` | High-throughput JavaScript runtime engine |
| **Express.js** | `^4.18.2` | Fast, minimalist HTTP server framework |
| **MongoDB Atlas / Community** | `v6.x / v7.x` | NoSQL document database with replica set transaction support |
| **Mongoose ODM** | `^8.0.3` | Object data modeling, schema validation, middleware hooks |
| **JSON Web Token (jsonwebtoken)** | `^9.0.2` | Stateless authentication, signed bearer tokens with 7-day expiry |
| **bcryptjs** | `^2.4.3` | Cryptographic password hashing (salt rounds: 12) |
| **express-validator** | `^7.0.1` | Declarative, middleware-based request body & query validation |
| **cors** | `^2.8.5` | Cross-Origin Resource Sharing configuration |
| **dotenv** | `^16.3.1` | Environment variable management |
| **swagger-ui-express & swagger-jsdoc**| `^5.0.0` | Interactive OpenAPI 3.0 API documentation at `/api/docs` |
| **Jest & Supertest** | `^29.7.0` | Automated unit and integration testing suite |

### 3.2 Frontend Stack
| Technology / Package | Version | Purpose in Project |
| :--- | :--- | :--- |
| **React** | `^18.2.0` | Declarative component UI library |
| **Vite** | `^5.4.21` | Next-generation ultra-fast frontend build tool and dev server |
| **React Router DOM** | `^6.21.1` | Declarative client-side routing with protected layout routes |
| **Tailwind CSS** | `^3.4.1` | Utility-first CSS styling engine |
| **Lucide React** | `^0.303.0` | Modern, consistent iconography across all 20+ screens |
| **Axios** | `^1.6.5` | Promise-based HTTP client with request/response interceptors |
| **PostCSS & Autoprefixer** | `^8.4.32` | CSS processing and vendor prefixing |

### 3.3 Design & Branding Assets
- **Primary Color Palette:** Electric Lime (`#6DCE05`), Dark Noir / Deep Evergreen (`#011810`), Brand Darker (`#0A2B1D`), Lime Tint (`#E8F8D0`), Light Gray (`#F9FAFB`).
- **Brand Identity:** High-resolution custom brand logo (`frontend/src/Assets/Logo.jpeg`) rendered via a dedicated, fail-safe React component (`<Logo />`).

---

## 4. Complete Chronological Development Journey

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           PROJECT DEVELOPMENT LIFECYCLE                           │
├───────────────┬───────────────────────────────────────────────────────────────────┤
│ Phase 1       │ Inception, requirements breakdown & modular monolith scaffolding   │
│ Phase 2       │ Mongoose schema design, compound partial unique index & relations │
│ Phase 3       │ Express routing, controllers, transactional services & RBAC       │
│ Phase 4       │ React 18 UI construction: Customer, Operator, and Admin portals   │
│ Phase 5       │ Brand migration: Electric Lime / Dark Noir visual overhaul        │
│ Phase 6       │ Critical debugging: Input focus bug, React object child crashes   │
│ Phase 7       │ Real distance calculation & dynamic provider pricing engine       │
│ Phase 8       │ Assessment rubric audit: Stop Management, Operator Dashboard & docs│
│ Phase 9       │ Operator Bus Fleet Management & Customer Route Scheduling          │
│ Phase 10      │ Hero Photography, Brand Originality & Pan-India Route Alignment   │
└───────────────┴───────────────────────────────────────────────────────────────────┘
```

---

### Phase 1: Project Initialization & Architectural Scaffolding
- **Repository Setup:** Created a clean repository structure separating frontend and backend:
  - `backend/` for server runtime, database models, business services, and testing.
  - `frontend/` for Vite SPA, reusable atomic components, and layouts.
- **Git Hygiene:** Configured `.gitignore` to strictly exclude `node_modules/`, `.env`, build artifacts (`dist/`), and runtime logs.
- **Environment Templates:** Established placeholder `.env.example` templates ensuring no secrets or private keys were committed to source control.

---

### Phase 2: Database Schema Engineering & Data Modeling
We designed 8 specialized Mongoose schemas with strict data types, cross-collection references, and indexing:

1. **`User` (`user.model.js`):**
   - Fields: `name`, `email` (unique, lowercase, indexed), `password` (bcrypt hash), `phone`, `role` (`'customer' | 'operator' | 'admin'`), `createdAt`.
   - Methods: Password comparison (`comparePassword`) and pre-save hashing hooks.

2. **`Bus` (`bus.model.js`):**
   - Fields: `busNumber` (unique uppercase, e.g. `DL-01-AB-1234`), `name` (e.g. `Volvo 9600 Multi-Axle`), `type` (`'seater'`, `'sleeper'`, `'semi-sleeper'`, `'ac'`, `'non-ac'`), `totalSeats` (20–60), `seatLayout` (`'2x2'`, `'2x1'`), `amenities` (WiFi, Charging Point, Water Bottle, Blankets, Reading Light, Emergency Exit), `operator` (ref `User`).

3. **`Stop` (`stop.model.js`):**
   - Fields: `name` (unique, e.g. `Kashmere Gate ISBT`), `city` (e.g. `Delhi`), `state` (e.g. `Delhi NCR`).

4. **`Route` (`route.model.js`):**
   - Fields: `source` (ref `Stop`), `destination` (ref `Stop`), `distance` (in kilometers), `duration` (formatted string e.g. `5h 30m`), `stops` array with intermediate halt references, halt duration, and sequence order.

5. **`Trip` (`trip.model.js`):**
   - Fields: `bus` (ref `Bus`), `route` (ref `Route`), `operator` (ref `User`), `travelDate`, `departureTime`, `arrivalTime`, `fare` (base ticket price), `availableSeats` (atomic counter), `status` (`'scheduled'`, `'in-progress'`, `'completed'`, `'cancelled'`).

6. **`SeatAllocation` (`seatAllocation.model.js`) — Concurrency Engine:**
   - Fields: `trip` (ref `Trip`), `seatNumber` (e.g. `1A`, `12B`), `booking` (ref `Booking`), `user` (ref `User`), `status` (`'confirmed'`, `'cancelled'`), `allocatedAt`.
   - **Crucial Compound Unique Index:**
     ```javascript
     seatAllocationSchema.index(
       { trip: 1, seatNumber: 1 },
       { unique: true, partialFilterExpression: { status: 'confirmed' } }
     );
     ```

7. **`Booking` (`booking.model.js`):**
   - Fields: `pnr` (unique string, e.g. `BM-782194`), `user` (ref `User`), `trip` (ref `Trip`), `passengers` array (each with `name`, `age`, `gender`, `seatNumber`, `fare`), `boardingPoint` (ref `Stop`), `droppingPoint` (ref `Stop`), `totalFare`, `status` (`'confirmed'`, `'cancelled'`), `paymentStatus` (`'completed'`, `'refunded'`), `cancellationDetails` (`cancelledAt`, `cancellationCharge`, `refundAmount`, `refundStatus`, `reason`), `bookedAt`.

8. **`AuditLog` (`auditLog.model.js`):**
   - Fields: `user` (ref `User`), `action` (e.g. `CREATE_BUS`, `CANCEL_BOOKING`), `resource`, `resourceId`, `details`, `ipAddress`, `createdAt`.

---

### Phase 3: Backend RESTful API & Core Business Services
To avoid fat controllers, all business workflows were isolated in a dedicated service layer:

- **Authentication & RBAC (`auth.service.js`):**
  - Handles JWT issuance, bcrypt password hashing, and user profile resolution.
  - Features an **Evaluator Auto-Provisioning Mechanism** that automatically verifies or seeds demo credentials on the fly (`admin@demo.com`, `operator@demo.com`, `customer@demo.com` with `Demo@123`).
- **Atomic Booking Engine (`booking.service.js`):**
  - Employs MongoDB transactions (session-based) on replica sets with automatic fallback to atomic checks.
  - Atomically verifies seat availability, inserts `SeatAllocation` records, decrements `availableSeats`, generates a unique PNR, and creates the confirmed `Booking`.
  - Catches duplicate key code `11000` errors and returns an HTTP `409 Conflict` with clear messaging.
- **Configurable Cancellation Service (`cancellation.service.js`):**
  - Computes time remaining between cancellation request and scheduled departure.
  - Automatically calculates refund slab percentages (>24h = 80%, 12-24h = 50%, <12h = 0%).
  - Flips `SeatAllocation` status to `'cancelled'`, releasing the seat for instant re-booking.
  - Updates `Trip.availableSeats` and records complete audit details.
- **Reporting & Occupancy Analytics (`report.service.js`):**
  - Aggregates overall system counts (users, buses, routes, trips, bookings, revenue).
  - Calculates daily revenue breakdowns and per-trip seat occupancy percentages.
- **Operator Operations Service (`operator.service.js`):**
  - Fetches trips assigned specifically to the logged-in operator.
  - Compiles real-time passenger manifests sorted by seat number with passenger ages, contact numbers, and boarding terminals.
- **API Documentation (`swagger.js`):**
  - Generated comprehensive OpenAPI 3.0 documentation served interactively at `/api/docs`.

---

### Phase 4: Frontend Architecture & User Journey Workflows
We structured the React application with 3 layered layouts and 20+ specialized pages:

```
frontend/src/
├── components/          # 17 Reusable UI Components & Modals
├── context/             # AuthContext (JWT state, login/logout, user role)
├── layouts/             # PublicLayout, AdminLayout, OperatorLayout
├── pages/               # Customer & Public Pages
│   ├── admin/           # Admin Management Pages (8 Pages)
│   └── operator/        # Operator Operations Pages (3 Pages)
├── services/            # Axios API Clients & Interceptors
└── utils/               # City formatters, distance calculators, helpers
```

#### Core User Journeys Built:
1. **Public & Customer Journey:**
   - **`HomePage.jsx`:** Destination search bar, date pickers, popular routes, customer reviews, mobile app promotion banner, and live animated highway simulation.
   - **`SearchResultsPage.jsx`:** Dynamic bus cards, filter sidebar (AC/Non-AC, Sleeper/Seater, departure slots, operator brands), available seats indicator.
   - **`TripDetailPage.jsx`:** Comprehensive route view, bus specifications, boarding/dropping terminal stops.
   - **`SeatSelectionPage.jsx`:** Interactive SVG seat deck (Upper/Lower or 2×2 layout) with live seat status (Available, Selected, Booked).
   - **`PassengerDetailsPage.jsx`:** Dynamic forms capturing individual passenger details per selected seat.
   - **`BookingConfirmPage.jsx`:** Fare summary, tax breakdown, simulated payment option selector.
   - **`TicketPage.jsx`:** Full digital boarding pass with PNR, QR code graphic, passenger roster, and browser print action.
   - **`MyBookingsPage.jsx`:** Customer trip history, live cancellation trigger with instant refund calculation modal.
2. **Admin Console Journey:**
   - **`AdminDashboard.jsx`:** High-level metrics, revenue charts, quick fleet status.
   - **`BusManagement.jsx`:** Bus fleet CRUD with seat layout builder.
   - **`RouteManagement.jsx`:** Inter-city routes with distance and duration.
   - **`StopManagement.jsx`:** Transit hubs directory with state/city metrics.
   - **`TripManagement.jsx`:** Trip schedule dispatcher and fare setter.
   - **`BookingManagement.jsx`:** Global booking registry with PNR search.
   - **`UserManagement.jsx`:** User role switcher (customer/operator/admin).
   - **`AuditLogs.jsx`:** Security audit trail viewer.
3. **Operator Console Journey:**
   - **`OperatorDashboard.jsx`:** Fleet occupancy percentage, active trip counters, seat utilization progress bars.
   - **`OperatorTrips.jsx`:** Detailed view of assigned trips with schedule info.
   - **`PassengerManifest.jsx`:** Official passenger roster for conductor boarding verification.

---

### Phase 5: Brand Identity & UI/UX Re-Engineering (Electric Lime & Noir)
Following the user's provision of the company logo (`frontend/src/Assets/Logo.jpeg`), the entire frontend underwent a complete visual migration:
- **Signature Design System:**
  - Upgraded Tailwind color tokens:
    - Primary Accent: `#6DCE05` (BusMitra Electric Lime)
    - Dark Primary: `#011810` (Dark Noir / Deep Forest)
    - Darker Accent: `#0A2B1D`
    - Soft Accent Tint: `#E8F8D0`
- **Component Redesign:**
  - Built `<Logo />` component (`frontend/src/components/Logo.jsx`) featuring the provided graphic image with an SVG bus fallback.
  - Replaced all legacy styling across the navigation bar, search forms, buttons, cards, badges, and layout sidebars.

---

### Phase 6: Critical Bug Fixes, React Optimization & Defect Resolutions
During active testing and evaluation, several intricate defects were diagnosed and systematically resolved:

#### 1. Input Focus Loss Bug (Single Character Typing)
- **Symptom:** In `RegisterPage.jsx` and `LoginPage.jsx`, typing one character caused the input box to immediately lose cursor focus, requiring the user to click the field again for every single character.
- **Root Cause:** An inline helper component `const InputField = (...) => <input ... />` was defined *inside* the parent `RegisterPage` function. On every keystroke, React state updated, triggering a re-render of `RegisterPage`. Because `InputField` was declared inside the body, its component reference was recreated, causing React to completely unmount and remount the DOM input element.
- **Fix:** Moved `InputField` outside the parent component scope into a module-level pure component and removed inline DOM mutations. Cursor focus is now permanently retained.

#### 2. React Object Child Crashes (`Objects are not valid as a React child`)
- **Symptom:** Admin dashboard, booking tables, and routes crashed with `Uncaught Error: Objects are not valid as a React child (found: object with keys {_id, name, city, state})`.
- **Root Cause:** When Mongoose `.populate('source')` or `.populate('destination')` was executed, the backend returned an object `{ _id, name, city, state }`. The frontend code assumed a plain string and attempted to render `{route.source}` directly.
- **Fix:** Created a centralized formatting helper `resolveCityName()` in `frontend/src/utils/formatters.js` to safely resolve strings, populated objects, or fallback placeholders.

#### 3. Route Search Prototype Crash (`.toLowerCase is not a function`)
- **Symptom:** Navigating to `/admin/routes` threw `Uncaught TypeError: (r.source || "").toLowerCase is not a function`.
- **Root Cause:** The filter expression `(r.source || "").toLowerCase()` failed because `r.source` was a populated Mongoose object rather than a string.
- **Fix:** Replaced with `resolveCityName(r.source).toLowerCase()`.

#### 4. Quick Demo Login Authentication Failure
- **Symptom:** Clicking the 1-click Quick Demo login buttons returned "Invalid email or password" if the database had been freshly reset.
- **Root Cause:** Demo users did not exist in freshly seeded or empty MongoDB Atlas instances.
- **Fix:** Updated `backend/src/services/auth.service.js` with an automated provisioning check. If `admin@demo.com`, `operator@demo.com`, or `customer@demo.com` does not exist when requested, the backend automatically creates the user with the correct role and default password (`Demo@123`).

#### 5. React Router v7 Deprecation Flags
- **Symptom:** Console warnings regarding future React Router transitions and relative splat paths.
- **Fix:** Configured `future={{ v7_startTransition: true, v7_relativeSplatPath: true }}` on `<BrowserRouter>` in `App.jsx`.

---

### Phase 7: Real-World Dynamic Pricing & Inter-City Distance Engine
Initially, search results exhibited static prices. The user requested authentic calculations matching real-world distances and operator tiers:
- **Distance Matrix (`backend/src/utils/distance.js`):**
  - Implemented great-circle Haversine formula with highway curvature multipliers (1.2×) for accurate road travel distances between 25+ major Indian cities (Delhi, Jaipur, Mumbai, Pune, Bangalore, Hyderabad, Chennai, Agra, Chandigarh, Lucknow, Ahmedabad, etc.).
- **Service Provider Engine (`backend/src/utils/providers.js`):**
  - Configured 8 realistic bus fleet brands (BusMitra Royal Express, Zingbus Maxx, NueGo Electric Green, IntrCity SmartBus, VRL Travels Premium, SRS Sleeper Class, Orange Luxury Coaches, Hans Travels).
  - Added class multipliers (AC Sleeper: 1.5×, Multi-Axle: 1.4×, Semi-Sleeper: 1.2×, Standard Seater: 1.0×).
- **Dynamic Calculation in `trip.service.js`:**
  - Base fare is computed dynamically: $\text{Fare} = \text{Distance} \times \text{Rate Per Km} \times \text{Class Multiplier} + \text{Toll/GST}$.

---

### Phase 8: Assessment Rubric Audit & Final Feature Completion
We conducted a line-by-line audit of the Algions AI Labs assessment PDF (`06_Bus_Booking_Management_System.pdf`) and completed all remaining scope items:
1. **Transit Stop Management UI (`StopManagement.jsx`):**
   - Built a complete management view for transit hubs with active city/state metrics, search filtering, and an "Add New Stop" modal.
   - Connected `POST /api/stops` and `GET /api/stops`.
   - Added `Stops` to `AdminLayout.jsx` navigation and registered `/admin/stops` in `App.jsx`.
2. **Operator Dashboard & Summary Reporting (`OperatorDashboard.jsx`):**
   - Created an executive operations dashboard displaying total assigned trips, passenger manifest shortcuts, and live fleet occupancy percentage progress bars.
   - Connected to `OperatorLayout.jsx` and updated the default operator redirect to `/operator/dashboard`.
3. **Comprehensive Technical Report (`TECHNICAL_REPORT.md`):**
   - Created a 10-section technical report including system architecture, data models, concurrency control rationale, cancellation rules, test suite summaries, and a minute-by-minute video walkthrough guide.
4. **Mermaid ER Diagram:**
   - Embedded a full Entity-Relationship diagram in both `README.md` and `TECHNICAL_REPORT.md`.

---

### Phase 9: Operator Bus Fleet Management & Route Scheduling
To empower bus operators with self-serve fleet deployment and schedule publishing for customers:
1. **Operator Fleet Management UI (`OperatorBuses.jsx`):**
   - Implemented a dedicated fleet workspace at `/operator/buses` for operators to manage all buses belonging to their fleet.
   - Features: Total Fleet Buses counter, Active In-Service status, total passenger berths metric, real-time search, and full CRUD controls (Add New Bus, Edit Coach Specs, and Delete Bus).
   - "Schedule on New Route" direct action button on every coach card.
2. **Add Bus to Route Dispatcher (`OperatorScheduleTrip.jsx`):**
   - Built a comprehensive trip scheduling interface at `/operator/schedule-trip` allowing operators to select one of their buses, choose a route corridor, specify travel dates, departure/arrival schedules, and seat pricing.
   - Includes an inline "Create New Route Corridor" modal for opening brand-new inter-city routes between any transit hubs.
   - Once published, departures appear immediately in customer search results for booking, and synchronize with the operator's passenger manifests.
3. **Server-Side RBAC & Endpoint Elevation:**
   - Updated `POST /api/buses`, `PUT /api/buses/:id`, `DELETE /api/buses/:id`, `GET /api/buses/my`, and `POST /api/trips`, `PUT /api/trips/:id`, `DELETE /api/trips/:id`, and `POST /api/routes` to authorize `('operator', 'admin')`.
   - Enforced strict multi-tenant ownership checks: operators can only update or schedule trips using buses belonging to their own fleet.

---

### Phase 10: Hero Photography, Brand Originality & Pan-India Route Alignment
1. **Hero Background Photography Integration:**
   - Integrated the real-world highway coach asset `frontend/src/Assets/Sunset Highway Journey with BusMitra.webp` into `HomePage.jsx`.
   - Crafted a multi-layer cinematic overlay (deep brand noir `#011810` multiplier, directional gradient vignette for maximum headline text contrast, and top/bottom vertical blends) eliminating raw AI artifacts and delivering a polished, high-end mobility product aesthetic.
   - Enhanced the floating search card with `backdrop-blur-xl bg-[#011810]/92 border-white/15` and micro trust badges (Zero Booking Fees, Live GPS Tracking, Instant M-Ticket).
2. **Complete Removal of External Third-Party References:**
   - Performed an exhaustive audit across the entire frontend and backend codebase to eliminate all references to external brand copy (FlixBus, Flix, Farestone).
   - Replaced all third-party provider ids with custom brand identities (`BusMitra Royal Express`, `op-busmitra-express`).
3. **Exclusively Pan-India Service Scope:**
   - Replaced all international destinations and US highway corridors with authentic Indian travel hubs and high-demand express routes (Delhi–Agra Yamuna Expressway, Bangalore–Mysore Highway, Hyderabad–Vijayawada Deccan Express, Jaipur–Jodhpur Heritage Link, Varanasi, Kochi, Agra, Surat).
   - Standardized currency exclusively to Indian Rupee (`INR (₹)`) and regional languages (`English`, `Hindi`, `Marathi`, `Kannada`).

---

## 5. Complete Inventory of Every File in the System

### 5.1 Backend File Structure
```
backend/
├── server.js                          # Express application entry point & port listener
├── package.json                       # Backend dependencies and test scripts
├── jest.config.js                     # Jest unit/integration test runner configuration
├── .env.example                       # Placeholder configuration template
│
├── src/
│   ├── config/
│   │   ├── db.js                      # MongoDB connection with Mongoose ODM
│   │   └── swagger.js                 # OpenAPI 3.0 JSDoc specification setup
│   │
│   ├── models/
│   │   ├── user.model.js              # User schema with bcrypt & role-based validation
│   │   ├── bus.model.js               # Bus fleet schema with layout & amenities
│   │   ├── stop.model.js              # Transit hub & bus terminal schema
│   │   ├── route.model.js             # Route corridors with distance & halt sequence
│   │   ├── trip.model.js              # Scheduled journeys with fare & seat counter
│   │   ├── seatAllocation.model.js    # Concurrency control & unique compound index
│   │   ├── booking.model.js           # Booking schema with PNR & cancellation details
│   │   └── auditLog.model.js          # Immutable security audit trail
│   │
│   ├── controllers/
│   │   ├── auth.controller.js         # Register, login, profile endpoints
│   │   ├── bus.controller.js          # Bus fleet CRUD handlers
│   │   ├── stop.controller.js         # Transit hub handlers
│   │   ├── route.controller.js        # Route management handlers
│   │   ├── trip.controller.js         # Trip search, layout & scheduling handlers
│   │   ├── booking.controller.js      # Booking, PNR lookup & cancellation handlers
│   │   ├── operator.controller.js     # Operator assigned trips & manifest handlers
│   │   ├── report.controller.js       # Admin dashboard & occupancy analytics
│   │   ├── user.controller.js         # User registry & role elevation handlers
│   │   └── auditLog.controller.js     # Audit log query handlers
│   │
│   ├── services/
│   │   ├── auth.service.js            # Auth business logic & demo auto-provisioning
│   │   ├── booking.service.js         # Atomic seat allocation engine with transactions
│   │   ├── cancellation.service.js    # Slab-based refund calculation & seat release
│   │   ├── trip.service.js            # Dynamic pricing & route search engine
│   │   ├── operator.service.js        # Manifest compilation & trip assignment
│   │   ├── report.service.js          # Revenue aggregation & occupancy math
│   │   └── stop.service.js            # Hub lookup & creation logic
│   │
│   ├── routes/
│   │   ├── auth.routes.js             # /api/auth routes
│   │   ├── bus.routes.js              # /api/buses routes
│   │   ├── stop.routes.js             # /api/stops routes
│   │   ├── route.routes.js            # /api/routes routes
│   │   ├── trip.routes.js             # /api/trips routes
│   │   ├── booking.routes.js          # /api/bookings routes
│   │   ├── operator.routes.js         # /api/operators routes
│   │   ├── report.routes.js           # /api/reports routes
│   │   ├── user.routes.js             # /api/users routes
│   │   └── auditLog.routes.js         # /api/audit-logs routes
│   │
│   ├── middleware/
│   │   ├── auth.js                    # JWT Bearer verification middleware
│   │   ├── authorize.js               # Server-side RBAC authorization guard
│   │   ├── auditLogger.js             # Asynchronous action audit logger
│   │   ├── errorHandler.js            # Central error handler with HTTP status mapping
│   │   └── validate.js                # express-validator execution runner
│   │
│   ├── validators/
│   │   ├── auth.validator.js          # Input validation schemas for login/register
│   │   ├── booking.validator.js       # Validation for booking & cancellation payloads
│   │   ├── bus.validator.js           # Bus creation & update schemas
│   │   ├── route.validator.js         # Route source/destination schemas
│   │   ├── stop.validator.js          # Stop name, city, state schemas
│   │   └── trip.validator.js          # Trip scheduling schemas
│   │
│   ├── utils/
│   │   ├── distance.js                # Inter-city Haversine road distance database
│   │   ├── providers.js               # Bus operator tiers & service multipliers
│   │   ├── pnr.js                     # Cryptographically unique PNR generator
│   │   └── response.js                # Standardized JSON success/error response helpers
│   │
│   ├── seed/
│   │   └── index.js                   # Comprehensive demo database seeder script
│   │
│   └── tests/
│       ├── auth.test.js               # Auth, registration, and RBAC security tests
│       └── booking.test.js            # Concurrency, 409 conflict, and cancellation tests
```

### 5.2 Frontend File Structure
```
frontend/
├── index.html                         # SPA HTML entry point with viewport & title
├── package.json                       # Frontend dependencies and Vite build scripts
├── vite.config.js                     # Vite configuration with /api backend proxy
├── tailwind.config.js                 # Tailwind CSS theme with Electric Lime & Noir tokens
├── postcss.config.js                  # PostCSS plugin pipeline
├── .env.example                       # Frontend environment template (VITE_API_BASE_URL)
│
├── src/
│   ├── main.jsx                       # React 18 DOM mount point
│   ├── App.jsx                        # Central BrowserRouter, route tree & future flags
│   ├── index.css                      # Tailwind base, components & animation definitions
│   │
│   ├── Assets/
│   │   └── Logo.jpeg                  # Official high-resolution BusMitra logo graphic
│   │
│   ├── components/
│   │   ├── Logo.jsx                   # Branded logo component with fallback
│   │   ├── Navbar.jsx                 # Responsive top header with role-aware menu
│   │   ├── Footer.jsx                 # Public footer with links, policies & copyright
│   │   ├── SearchForm.jsx             # Origin/Destination search bar with date pickers
│   │   ├── LoadingSpinner.jsx         # Clean loading indicator with animated spinner
│   │   ├── ErrorMessage.jsx           # Dismissible error notification banner
│   │   ├── SuccessMessage.jsx         # Dismissible success notification banner
│   │   ├── Modal.jsx                  # Accessible, animated modal dialog wrapper
│   │   ├── StatusBadge.jsx            # Status pill component (Confirmed, Cancelled, etc.)
│   │   ├── Pagination.jsx             # Accessible data table pagination control
│   │   ├── ProtectedRoute.jsx         # JWT authentication & RBAC route guard
│   │   ├── AppDownloadModal.jsx       # Mobile app download modal with QR code
│   │   ├── ExploreMapModal.jsx        # Visual route network map modal
│   │   ├── ManageBookingModal.jsx     # Quick PNR retrieval modal
│   │   ├── TripTrackerModal.jsx       # Live journey tracking simulation modal
│   │   └── ServiceModal.jsx           # BusMitra amenities & travel conditions modal
│   │
│   ├── context/
│   │   └── AuthContext.jsx            # React Context for user state, JWT & login/logout
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx           # Public portal wrapper (Navbar + Content + Footer)
│   │   ├── AdminLayout.jsx            # Admin console wrapper with collapsible sidebar
│   │   └── OperatorLayout.jsx         # Operator portal wrapper with fleet sidebar
│   │
│   ├── pages/
│   │   ├── HomePage.jsx               # Hero search, popular routes, live expressway
│   │   ├── SearchResultsPage.jsx      # Filterable bus cards with departure/fare filters
│   │   ├── TripDetailPage.jsx         # Detailed trip specifications and route stops
│   │   ├── SeatSelectionPage.jsx      # Interactive 2x2 / 2x1 deck seat picker
│   │   ├── PassengerDetailsPage.jsx   # Multi-passenger information capture form
│   │   ├── BookingConfirmPage.jsx     # Fare breakdown & simulated payment gateway
│   │   ├── TicketPage.jsx             # Digital boarding pass with QR code & print action
│   │   ├── MyBookingsPage.jsx         # Customer history & time-slab cancellation modal
│   │   ├── LoginPage.jsx              # Login with 1-click Quick Demo evaluator buttons
│   │   ├── RegisterPage.jsx           # Clean customer account registration
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx     # Executive metrics, revenue & bookings overview
│   │   │   ├── BusManagement.jsx      # Bus fleet CRUD with seat layout designer
│   │   │   ├── RouteManagement.jsx    # Inter-city route corridor management
│   │   │   ├── StopManagement.jsx     # Transit hub & terminal management
│   │   │   ├── TripManagement.jsx     # Trip dispatcher, schedule & fare configuration
│   │   │   ├── BookingManagement.jsx  # Global booking registry & PNR search
│   │   │   ├── UserManagement.jsx     # User registry & role elevation
│   │   │   └── AuditLogs.jsx          # Security audit trail viewer
│   │   │
│   │   └── operator/
│   │       ├── OperatorDashboard.jsx  # Fleet occupancy summaries & manifest shortcuts
│   │       ├── OperatorBuses.jsx      # Operator bus fleet management & coach registration
│   │       ├── OperatorScheduleTrip.jsx # Deploy bus to new route & publish customer schedule
│   │       ├── OperatorTrips.jsx      # Assigned trip schedules & bus details
│   │       └── PassengerManifest.jsx  # Conductor passenger boarding manifest
│   │
│   ├── services/
│   │   └── api.js                     # Axios instance with JWT interceptors & API methods
│   │
│   └── utils/
│       └── formatters.js              # City name resolver & currency formatters
```

---

## 6. Deep-Dive Problem Solving & Debugging Log

| # | Bug / Challenge Encountered | Root Cause Diagnosis | Permanent Engineering Solution |
| :-: | :--- | :--- | :--- |
| **1** | **Input Focus Loss on Typing (1 char at a time)** | An inline `InputField` component was defined *inside* `RegisterPage.jsx`. On each keystroke, React state updated, triggering a re-render that recreated the component definition and remounted the input element. | Extracted `InputField` to module scope as a stable pure component; removed inline DOM mutations. Focus is preserved seamlessly. |
| **2** | **React Object Child Crash**<br>`Objects are not valid as a React child` | Mongoose `.populate('source')` returned `{ _id, name, city, state }`. Frontend code attempted to render `{route.source}` directly. | Created `resolveCityName()` in `formatters.js` to safely resolve strings, objects, or fallback values. |
| **3** | **Route Search Lowercase Crash**<br>`(r.source \|\| "").toLowerCase is not a function` | Filter function in `RouteManagement.jsx` invoked `.toLowerCase()` directly on a populated Mongoose object. | Wrapped with `resolveCityName(r.source).toLowerCase()`. |
| **4** | **Demo Evaluator Login Failure**<br>`Invalid email or password` | In newly created MongoDB Atlas databases, demo accounts were absent prior to seeding. | Added auto-provisioning logic in `auth.service.js` that checks for `admin@demo.com`, `operator@demo.com`, and `customer@demo.com` and creates them on the fly if missing. |
| **5** | **Missing Key Props on Tables** | Iterated table rows in `AdminDashboard.jsx` and `BookingManagement.jsx` lacked unique `key` props. | Bound stable keys using `booking._id \|\| booking.pnr \|\| index`. |
| **6** | **Static Search Results** | Search results previously returned static mock lists regardless of entered cities. | Implemented `distance.js` and `providers.js` to dynamically compute road kilometers, duration, and dynamic ticket fares. |
| **7** | **Incomplete Transit Hub Management** | Section 1 of the assessment required managing transit stops; frontend lacked a dedicated UI. | Built `StopManagement.jsx` with city/state counters, search, and creation modal; added to admin sidebar and routing. |
| **8** | **Missing Operator Summary Reporting** | Assessment required operator reporting on schedules, manifests, and occupancy summaries. | Implemented `OperatorDashboard.jsx` with occupancy KPIs, progress bars, and manifest shortcuts. |

---

## 7. Concurrency, Double-Booking & Atomic Transactions

A critical requirement of the assessment was **Seat Integrity: Prevent duplicate confirmed bookings for the same trip seat, including simultaneous booking requests.**

### 7.1 The Race Condition Threat
When User A and User B simultaneously click "Confirm Booking" for Seat 14A at 10:00:00.120 AM, traditional systems query the database, find the seat unoccupied, and create two conflicting booking records.

### 7.2 The BusMitra Solution
We implemented a two-layered defense:

```
User A Request ──────────┐
                         ├─► MongoDB Atomic Transaction Session
User B Request ──────────┘   │
                             ├──► 1. Check Seat Availability
                             ├──► 2. Insert SeatAllocation Record
                             │       └──► COMPOUND UNIQUE INDEX: { trip: 1, seatNumber: 1 }
                             │            where status == 'confirmed'
                             │            ├──► User A: SUCCESS (Index committed)
                             │            └──► User B: DUPLICATE KEY ERROR (Code 11000)
                             │
                             ├──► 3. Atomic Decrement: Trip.availableSeats
                             ├──► 4. Issue Unique PNR & Booking Record
                             │
                             └──► Error Interceptor:
                                  Rollback User B transaction -> Return HTTP 409 Conflict
```

1. **Compound Partial Unique Index:**
   ```javascript
   seatAllocationSchema.index(
     { trip: 1, seatNumber: 1 },
     { unique: true, partialFilterExpression: { status: 'confirmed' } }
   );
   ```
2. **MongoDB Replica Set Transaction Session:**
   - Both `SeatAllocation` insertion, `Trip.availableSeats` decrement, and `Booking` creation occur within an atomic session (`session.startTransaction()`).
   - If any step fails or violates uniqueness, the entire transaction is aborted, leaving zero orphan records.
3. **Re-bookability Guarantee:**
   - Because the index only checks `{ status: 'confirmed' }`, when a ticket is cancelled, the allocation's status is updated to `'cancelled'`. The seat is immediately freed for another passenger while preserving the original booking's audit record.

---

## 8. Configurable Cancellation & Refund Rules Engine

The cancellation engine enforces dynamic, time-bracketed refund calculation:

$$\text{Hours Remaining} = \frac{\text{Trip Departure Time} - \text{Current Request Time}}{3600 \times 1000}$$

| Window Prior to Departure | Refund Percentage | Cancellation Fee | Ticket Status | Refund Status |
| :--- | :---: | :---: | :---: | :---: |
| **$\ge 24$ Hours** | **80%** | 20% | `cancelled` | `processed` |
| **$12 \text{ to } 24$ Hours** | **50%** | 50% | `cancelled` | `processed` |
| **$< 12$ Hours** | **0%** (No refund) | 100% | `cancelled` | `not_eligible` |

### Audit & State Guarantees:
- Seat allocations are marked as `cancelled`, releasing the seat on the bus seat map.
- The trip's `availableSeats` count is incremented atomically (`$inc: { availableSeats: seatsReleased }`).
- The original booking document retains `cancellationDetails` including exact timestamp, deduction fee, and simulated refund transaction ID.

---

## 9. Acceptance Criteria Demonstration & Verification Matrix

| # | Acceptance Criterion (from PDF) | How It Was Implemented | Verification Evidence |
| :-: | :--- | :--- | :--- |
| **1** | **A passenger can search a valid trip and book an available seat.** | `HomePage.jsx` search form links to `SearchResultsPage.jsx`, interactive seat deck in `SeatSelectionPage.jsx`, passenger form in `PassengerDetailsPage.jsx`, and instant PNR in `TicketPage.jsx`. | Verified in manual UI flows and automated tests (`POST /api/bookings`). |
| **2** | **Two users cannot confirm the same seat on one trip.** | Compound unique partial index `{ trip: 1, seatNumber: 1 }` enforced at DB layer with atomic transaction rollback. | Automated test in `backend/src/tests/booking.test.js` confirms second user receives `409 Conflict`. |
| **3** | **The PNR includes correct passenger, route, date and seat details.** | Unique PNR (`BM-XXXXXX`) stores passenger roster (name, age, gender, seat number), departure terminal, arrival terminal, travel date, and fare. | Rendered on printable digital boarding pass (`TicketPage.jsx`) and verified via `GET /api/bookings/pnr/:pnr`. |
| **4** | **Cancellation changes seat availability and refund status according to the rule.** | `cancellation.service.js` calculates exact refund slab, marks seats cancelled, and atomically increments `Trip.availableSeats`. | Tested in `booking.test.js` showing seat availability increments and seat can be rebooked. |
| **5** | **Operator manifest and occupancy summaries reconcile with confirmed tickets.** | `OperatorDashboard.jsx` computes occupancy %; `PassengerManifest.jsx` lists all confirmed passengers sorted by seat number with contact info. | Verified in operator portal and manifest endpoint (`GET /api/operators/trips/:id/manifest`). |

---

## 10. Final Evaluation & Submission Readiness

The BusMitra project is **100% feature-complete**, fully functional, and production-ready.

### Summary Checklist:
- [x] Full-stack architecture with modular separation of UI, business logic, and database persistence.
- [x] Server-side RBAC protecting Customer, Operator, and Admin roles.
- [x] Complete database schema with Mongoose models, relations, validations, and indexes.
- [x] Concurrency protection with atomic transactions and 409 Conflict duplicate seat rejection.
- [x] Configurable cancellation rules with simulated refund calculations and audit history.
- [x] Operator reporting suite with route schedules, seat occupancy reconciliation, and passenger manifests.
- [x] Operator fleet management with self-serve bus registration, seat layout config, and bus CRUD.
- [x] Operator route scheduling to deploy buses onto inter-city corridors and publish customer departures.
- [x] Transit stop management for complete operator and route configuration.
- [x] 1-Click Quick Demo logins for evaluators (`admin@demo.com`, `operator@demo.com`, `customer@demo.com` with `Demo@123`).
- [x] Interactive OpenAPI/Swagger 3.0 documentation at `/api/docs`.
- [x] Automated test suites covering positive, negative, and race-condition edge cases.
- [x] Comprehensive documentation package: [README.md](README.md), [TECHNICAL_REPORT.md](TECHNICAL_REPORT.md), and [PROJECT_DEVELOPMENT_JOURNEY.md](PROJECT_DEVELOPMENT_JOURNEY.md).
- [x] Clean production build verified via `npm --prefix frontend run build` with **0 errors**.

