# 🏗️ Eventify — Architecture Document

This document describes the system architecture, data flow, and design decisions behind the Eventify platform.

---

## 1. System Overview

Eventify is a **full-stack web application** with a decoupled frontend and backend communicating over a REST API.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                     │
│                                                             │
│   React 19 + Vite 8 + TailwindCSS 4                        │
│   ┌──────────┐  ┌────────────┐  ┌─────────────────────┐    │
│   │  Router   │  │   Pages    │  │    Components       │    │
│   │ (8 routes)│  │ (8 pages)  │  │ (Navbar, Cards,     │    │
│   │          │  │            │  │  FindPlannerModal,   │    │
│   │          │  │            │  │  ChatWindow)         │    │
│   └──────────┘  └────────────┘  └─────────────────────┘    │
│         │              │                   │                │
│         └──────────────┼───────────────────┘                │
│                        │                                    │
│               AuthContext (React Context)                   │
│                        │                                    │
│                   Axios HTTP                                │
└────────────────────────┼────────────────────────────────────┘
                         │  REST API (JSON)
                         │  http://localhost:8000
┌────────────────────────┼────────────────────────────────────┐
│                        ▼                                    │
│                  FastAPI Server                             │
│                                                             │
│   ┌──────────┐  ┌────────────┐  ┌─────────────────────┐    │
│   │  Routes   │  │  Schemas   │  │     Models          │    │
│   │ (main.py) │  │(schemas.py)│  │   (models.py)       │    │
│   │  9 endpoints│ │ Pydantic  │  │   SQLAlchemy ORM    │    │
│   └──────────┘  └────────────┘  └─────────────────────┘    │
│                        │                                    │
│                   SQLAlchemy                                │
│                   Session                                   │
│                        │                                    │
│               ┌────────▼────────┐                           │
│               │   SQLite DB     │                           │
│               │  (events.db)    │                           │
│               └─────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture

### 2.1 Technology Choices

| Choice | Rationale |
|---|---|
| **React 19** | Latest stable React with improved rendering and hooks |
| **Vite 8** | Blazing fast HMR and build times over CRA/Webpack |
| **TailwindCSS 4** | Utility-first CSS with new v4 `@theme` syntax for custom animations |
| **React Router 7** | Client-side routing with `BrowserRouter` |
| **Axios** | Promise-based HTTP client for clean API calls |
| **Lucide React** | Lightweight, consistent icon library |

### 2.2 Component Hierarchy

```
App.jsx (Router + Layout)
├── Navbar.jsx                    ← Sticky nav, auth-aware
│
├── Home.jsx                      ← Landing page (5 sections)
│   ├── Hero Section              ← CTA + stats
│   ├── Categories Grid           ← 6 event type cards
│   ├── Why Eventify              ← 4 feature cards
│   ├── How It Works              ← 3-step dark card
│   ├── Featured Planners Grid    ← ManagerCard × N
│   │   └── ManagerCard.jsx       ← Individual planner card
│   ├── CTA Banner                ← Gradient footer CTA
│   └── FindPlannerModal.jsx      ← Smart match popup
│       ├── Step 1: Form          ← Event type, budget, guests, date
│       └── Step 2: Results       ← Matched planner list
│
├── Login.jsx                     ← Email + password login
├── Signup.jsx                    ← Registration with role selection
├── Dashboard.jsx                 ← Role-based dashboard
│   ├── Client View               ← Booking requests + planner info + chat
│   ├── Manager View              ← Incoming requests + Accept/Reject + chat
│   └── ChatWindow.jsx            ← In-app messaging modal
│       ├── Message Bubbles        ← Left/right aligned by sender
│       ├── Auto-polling (3s)      ← Fetches new messages
│       └── Input Bar              ← Send message form
├── ManagerDetails.jsx            ← Full planner profile page
├── RequestForm.jsx               ← Send booking proposal
├── BookingForm.jsx               ← Reserve an event slot
└── EventDetails.jsx              ← Event detail view
```

### 2.3 State Management

```
AuthContext (React Context API)
│
├── user          ← Current logged-in user object (or null)
├── login(data)   ← Sets user + persists to localStorage
└── logout()      ← Clears user + localStorage
```

- **No Redux or Zustand** — the app's state is simple enough for Context API
- **localStorage** persistence — user session survives page refresh
- **Component-local state** — each page manages its own data fetching via `useState` + `useEffect`

### 2.4 Routing Map

| Path | Component | Auth Required |
|---|---|---|
| `/` | `Home` | No |
| `/login` | `Login` | No |
| `/signup` | `Signup` | No |
| `/dashboard` | `Dashboard` | Yes |
| `/manager/:id` | `ManagerDetails` | No |
| `/request/:id` | `RequestForm` | Yes |
| `/event/:id` | `EventDetails` | No |
| `/book/:id` | `BookingForm` | Yes |

---

## 3. Backend Architecture

### 3.1 Technology Choices

| Choice | Rationale |
|---|---|
| **FastAPI** | High-performance async Python framework with auto-generated Swagger docs |
| **SQLAlchemy** | Mature Python ORM for database abstraction |
| **Pydantic** | Data validation and serialization built into FastAPI |
| **SQLite** | Zero-config file-based DB, ideal for development and small deployments |

### 3.2 API Design

The API follows REST conventions with JSON payloads:

```
POST /signup                              → Create user (+ optional manager profile)
POST /login                               → Authenticate & return user object
GET  /managers                            → List all managers
GET  /managers/match?event_type=&budget=  → Smart match (filter + sort)
POST /event-requests?client_id=           → Submit booking request
GET  /event-requests?user_id=&role=       → Get user's requests (role-aware)
PATCH /event-requests/{id}?status=        → Accept / Reject a request
POST /messages                            → Send a chat message
GET  /messages?event_request_id=          → Get conversation messages
```

### 3.3 Smart Match Algorithm

The `/managers/match` endpoint implements a 2-pass filter:

```
Input: event_type (string), budget (float)
                    │
                    ▼
        ┌───────────────────────┐
        │  Load all managers    │
        │  with role='manager'  │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  FILTER 1: Budget     │
        │  min_price ≤ budget   │  ← Skip if budget = 0
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  FILTER 2: Event Type │
        │  Case-insensitive     │  ← Substring match against
        │  substring match      │     comma-separated types
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  SORT by min_price    │
        │  ascending (best      │
        │  value first)         │
        └───────────┬───────────┘
                    │
                    ▼
              Return results
```

---

## 4. Data Model

### 4.1 ER Diagram

```
┌──────────────────────┐       1:1       ┌─────────────────────────┐
│        User          │────────────────▶│    ManagerProfile        │
├──────────────────────┤                 ├─────────────────────────┤
│ id          (PK)     │                 │ id            (PK)      │
│ full_name   (str)    │                 │ user_id       (FK→User) │
│ email       (unique) │                 │ business_name (str)     │
│ password    (str)    │                 │ event_types   (str,csv) │
│ role        (str)    │                 │ description   (str)     │
│  └─ "client"|"manager"                │ min_price     (float)   │
└──────────────────────┘                 │ image_url     (str)     │
         │                               └─────────────────────────┘
         │ 1:N
         ▼
┌──────────────────────┐
│    EventRequest      │
├──────────────────────┤
│ id                (PK)│
│ client_id    (FK→User)│
│ manager_id   (FK→User)│
│ event_type        (str)│
│ date              (str)│
│ budget          (float)│
│ special_requirements   │
│ status            (str)│
│  └─ "Pending"|"Accepted"|"Rejected"
└──────────┬───────────┘
           │ 1:N
           ▼
┌──────────────────────┐
│      Message         │
├──────────────────────┤
│ id                (PK)│
│ event_request_id (FK) │
│ sender_id    (FK→User)│
│ content         (str) │
│ timestamp  (datetime) │
└──────────────────────┘
```

### 4.2 Key Relationships

- **User ↔ ManagerProfile**: One-to-one. Only users with `role="manager"` have a profile.
- **User ↔ EventRequest**: One-to-many. A client can send multiple requests. A manager can receive multiple requests.
- **EventRequest ↔ Message**: One-to-many. Each booking conversation can have multiple chat messages.
- **Message → User**: Each message has a sender (either the client or manager in that conversation).
- **event_types field**: Stored as a comma-separated string (e.g., `"Wedding, Reception"`). Parsed at query time for filtering.

---

## 5. Design System

### 5.1 Visual Language

| Token | Value |
|---|---|
| **Font** | Plus Jakarta Sans |
| **Primary** | Indigo-600 (`#4F46E5`) |
| **Accent** | Fuchsia-600 (`#C026D3`) |
| **Background** | Slate-50 (`#F8FAFC`) |
| **Card Style** | Glassmorphism (`bg-white/80 backdrop-blur-xl`) |
| **Border Radius** | `2.5rem – 3rem` (large rounded) |
| **Shadows** | Subtle (`shadow-sm`) → Elevated (`shadow-2xl`) on hover |
| **Animations** | `fadeIn`, `fadeInUp`, `bounce` (scroll hint) |

### 5.2 UI Patterns

- **Glassmorphism cards** — Semi-transparent backgrounds with blur
- **Gradient text** — `bg-clip-text` for hero headings
- **Hover micro-animations** — `hover:-translate-y-1` lift effect on cards
- **Emoji-based category selectors** — Intuitive, no icon library needed
- **Modal overlay** — Backdrop blur + centered card with close-on-outside-click

---

## 6. Data Flow Diagrams

### 6.1 Smart Match Flow (User → Matched Planners)

```
User clicks "Find My Planner"
        │
        ▼
FindPlannerModal opens (Step 1)
        │
User selects: Event Type, Budget, Guest Count, Date
        │
        ▼ clicks "Find My Planners"
        │
Axios GET /managers/match?event_type=Wedding&budget=200000
        │
        ▼
FastAPI filters managers → returns sorted JSON
        │
        ▼
FindPlannerModal (Step 2) renders matched planners
        │
User clicks "View" → navigates to /manager/:id
```

### 6.2 Booking Flow (User → Event Request)

```
User on ManagerDetails page
        │
        ▼ clicks "Request Booking"
        │
Navigates to /request/:id (RequestForm)
        │
User fills: Event Type, Date, Budget, Vision & Details
        │
        ▼ submits form
        │
Axios POST /event-requests?client_id=5
  Body: { manager_id, event_type, date, budget, special_requirements }
        │
        ▼
Success screen → auto-redirect to Dashboard
```

### 6.3 Chat Flow (Client ↔ Manager)

```
User opens Dashboard → clicks "Chat" on a request card
        │
        ▼
ChatWindow modal opens
        │
        ├── GET /messages?event_request_id=3  (initial fetch)
        │
        ├── Poll every 3 seconds for new messages
        │
        ▼
User types message → clicks Send
        │
Axios POST /messages
  Body: { event_request_id, sender_id, content }
        │
        ▼
New message appended → auto-scrolls to bottom
        │
Other user sees it on next poll (≤3 seconds)
```

### 6.4 Accept/Reject Flow (Manager)

```
Manager opens Dashboard → sees incoming request with status "Pending"
        │
        ▼ clicks "Accept" or "Reject"
        │
Axios PATCH /event-requests/7?status=Accepted
        │
        ▼
Status badge updates instantly in UI
Client sees updated status on their Dashboard
```

---

## 7. Security Considerations

> ⚠️ **Current Limitations (Development Only)**

| Area | Current State | Production Recommendation |
|---|---|---|
| **Passwords** | Stored as plaintext | Use bcrypt/argon2 hashing |
| **Auth** | No tokens, user stored in localStorage | Implement JWT access/refresh tokens |
| **CORS** | `allow_origins=["*"]` | Restrict to frontend domain |
| **Input Validation** | Pydantic schemas for basic typing | Add field-level constraints |
| **Rate Limiting** | None | Add via middleware or API gateway |

---

## 8. Future Improvements

- [ ] **JWT Authentication** with refresh tokens
- [ ] **Password hashing** (bcrypt)
- [ ] **Image uploads** for manager profiles (S3/Cloudinary)
- [ ] **Reviews & ratings** system for planners
- [x] ~~**Real-time chat** between clients and planners~~ ✅ Implemented (polling-based)
- [x] ~~**Accept/Reject requests**~~ ✅ Implemented
- [x] ~~**Role-based dashboard**~~ ✅ Implemented
- [ ] **Payment integration** (Razorpay/Stripe)
- [ ] **Email notifications** for booking status changes
- [ ] **PostgreSQL** migration for production
- [ ] **Docker Compose** for one-command deployment
- [ ] **Admin panel** for managing planners and requests
- [ ] **WebSocket upgrade** for true real-time chat (replace polling)
- [ ] **Search & filter bar** on homepage (by type, budget, city)
- [ ] **Notification bell** for new messages and status updates
