# 🎉 Eventify — India's Event Planning Platform

Eventify connects people looking to host events (weddings, birthdays, receptions, corporate offsites) with verified Indian event planners — matched instantly to their budget and vision.

![Status](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Python](https://img.shields.io/badge/Python-3.10+-yellow) ![React](https://img.shields.io/badge/React-19-61DAFB)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Smart Planner Match** | Popup modal where users pick event type, budget, guest count & date — instantly matched with best-fit planners |
| 🏠 **Landing Page** | Premium hero section, event categories grid, "Why Eventify" features, "How It Works" steps, CTA banners |
| 👤 **Auth System** | Signup/Login for clients and managers with role-based views |
| 📋 **Manager Profiles** | Detailed profile pages with event types, pricing, descriptions, and images |
| 📩 **Event Requests** | Clients can send booking proposals to planners with budget, date, and requirements |
| 📊 **Dashboard** | Personalized dashboard showing active reservations and booking stats |
| 🇮🇳 **Indian Focus** | 12 pre-seeded Indian planners across Delhi, Mumbai, Chennai, Pune, Bangalore, Jaipur & more |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, TailwindCSS 4, React Router 7, Axios, Lucide Icons |
| **Backend** | Python, FastAPI, SQLAlchemy ORM, Pydantic |
| **Database** | SQLite (`events.db`) |
| **Styling** | TailwindCSS with glassmorphism, gradients, micro-animations |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **pip** (Python package manager)

### 1. Clone the repository

```bash
git clone <repo-url>
cd em
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic

# Seed the database with Indian planners
python seed_indian_planners.py

# Start the API server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/signup` | Register a new user (client or manager) |
| `POST` | `/login` | Authenticate user |
| `GET` | `/managers` | List all event managers |
| `GET` | `/managers/match?event_type=Wedding&budget=100000` | Smart match planners by type & budget |
| `POST` | `/event-requests?client_id={id}` | Submit a booking request to a planner |
| `GET` | `/event-requests?user_id={id}&role={role}` | Get requests for a user |

---

## 📂 Project Structure

```
em/
├── backend/
│   ├── main.py                  # FastAPI app & all endpoints
│   ├── models.py                # SQLAlchemy models (User, ManagerProfile, EventRequest)
│   ├── schemas.py               # Pydantic request/response schemas
│   ├── database.py              # DB engine, session, Base
│   ├── seed.py                  # Original seed script
│   ├── seed_indian_planners.py  # Seeds 12 Indian event planners
│   ├── add_10_planners.py       # Utility: add random planners
│   └── events.db                # SQLite database file
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Sticky nav with auth-aware links
│   │   │   ├── ManagerCard.jsx      # Planner card for the grid
│   │   │   ├── FindPlannerModal.jsx # Smart match popup modal
│   │   │   └── EventCard.jsx        # Event display card
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Full landing page with intro sections
│   │   │   ├── Login.jsx            # Login form
│   │   │   ├── Signup.jsx           # Registration (client/manager)
│   │   │   ├── Dashboard.jsx        # User dashboard
│   │   │   ├── ManagerDetails.jsx   # Individual planner profile
│   │   │   ├── RequestForm.jsx      # Booking request form
│   │   │   ├── BookingForm.jsx      # Event booking form
│   │   │   └── EventDetails.jsx     # Event detail page
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # React Context for auth state
│   │   ├── App.jsx                  # Router & layout
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles & Tailwind config
│   ├── package.json
│   └── vite.config.js
│
├── ARCHITECTURE.md
└── README.md
```

---

## 🌱 Seeded Planners

The platform comes pre-loaded with **12 Indian event planners**:

| Category | Planners | Price Range |
|---|---|---|
| 🎂 Birthday | Celebration Station, Party Wallah, Little Star Events | ₹12K – ₹25K |
| 💍 Wedding | Royal Shaadi Planners, Mangalya Weddings, Dream Dulhan Events | ₹1.5L – ₹3L |
| 🥂 Reception | Grand Gala Events, Jashn Celebrations | ₹75K – ₹1L |
| 💼 Corporate | Corporate Edge India, Officela Events, BizFest Planners | ₹35K – ₹1L |
| 🎊 All-round | Utsav Events Co. | ₹40K |

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).
