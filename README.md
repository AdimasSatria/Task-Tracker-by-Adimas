#  Premium Task Tracker — High-Performance Microservices Monorepo

> An enterprise-grade, distributed task management platform engineered with an **Apple & Samsung One UI** design philosophy, featuring generous whitespace, glassmorphism panels, and a high-throughput multi-language microservices architecture.

## 📱 Interface Preview

> **Note:** UI components heavily utilize `backdrop-filter` and CSS variables for a seamless Light/Dark mode transition.

![Dashboard Preview](https://via.placeholder.com/1000x500?text=Insert+Bento+Grid+Dashboard+Screenshot+Here)
*Immersive Dashboard with Bento Grid Layout & Glassmorphism*

---

## 🏛️ System Architecture Overview

The system is decoupled into autonomous, domain-focused microservices communicating via RESTful APIs and real-time bidirectional WebSockets:

```
                              ┌───────────────────────────────┐
                              │     Client Browser Layer      │
                              │  HTML5 + Modern CSS3 + JS     │
                              │  (Apple / Samsung One UI UX)  │
                              └───────────────┬───────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
            (HTTP / JSON)             (WebSocket 60fps)          (HTTP / Metric)
                    ▼                         ▼                         ▼
      ┌──────────────────────────┐ ┌──────────────────────┐ ┌───────────────────────┐
      │  services/core-api-php   │ │ services/realtime-go │ │services/analytics-py  │
      │  & services/core-api-java│ │ (Golang 1.21 Hub)    │ │ (Python FastAPI)      │
      │  (CRUD, Auth, Rules)     │ │ Sub-ms task broadcast│ │ Rolling velocity &    │
      └─────────────┬────────────┘ └──────────┬───────────┘ │ Burnout risk engine   │
                    │                         │             └───────────┬───────────┘
                    └──────────────────┐      │                         │
                                       ▼      ▼                         ▼
                                 ┌───────────────────────────────────────────┐
                                 │       MySQL 8.0 Relational Storage        │
                                 │   (Users, Tasks, Activity Audit Logs)     │
                                 └───────────────────────────────────────────┘
```

---

## ⚡ Tech Stack & Component Responsibilities

| Tier / Domain | Technology | Key Responsibilities |
| :--- | :--- | :--- |
| **Frontend** | Pure Semantic HTML5, CSS3, Vanilla JS | Glassmorphic Bento Grid, 60fps springs, Apple / Samsung One UI design, zero runtime overhead. |
| **Core CRUD & Auth** | PHP 8.2+ (PDO) or Java Spring Boot 3.2 | User authentication, RBAC, Task lifecycle management, validation, and relational persistence. |
| **High-Performance Realtime** | Go (Golang 1.21) + Gorilla WebSocket | Concurrent client session management via goroutines, sub-millisecond task synchronization. |
| **Data Analytics** | Python 3.11+ (FastAPI, NumPy, Pandas) | Real-time productivity velocity calculation, burnout risk assessment, peak focus hour detection. |
| **Database** | MySQL 8.0+ / MariaDB | Relational integrity, foreign key constraints, composite indexing on `(user_id, status)`. |

---

## 📂 Repository Directory Structure

```text
premium-task-tracker/
├── .gitignore                     # Comprehensive multi-language ignore rules
├── README.md                      # Architecture documentation & setup guide
├── database/
│   └── schema.sql                 # Production MySQL database schema with seed data
├── frontend/                      # Standalone client application
│   ├── index.html                 # Semantic HTML5 with Bento Grid layout
│   ├── style.css                  # Apple/Samsung One UI Glassmorphism design system
│   └── app.js                     # Vanilla JS reactive state & WebSocket client
└── services/
    ├── core-api-php/              # PHP Core CRUD & Auth microservice
    │   ├── index.php              # RESTful API router and PDO database abstraction
    │   └── composer.json          # PHP dependency manifest
    ├── core-api-java/             # Alternative Enterprise Java Spring Boot microservice
    │   ├── pom.xml                # Maven configuration with Spring Boot 3.2
    │   └── src/main/java/com/premiumtask/
    │       ├── model/Task.java    # JPA Entity definition
    │       └── controller/TaskController.java # Spring REST Controller
    ├── realtime-go/               # Go High-Performance WebSocket microservice
    │   ├── go.mod                 # Go module definition
    │   └── main.go                # Goroutines, Hub broadcast, Ping/Pong keep-alive
    └── analytics-python/          # Python Data Analytics engine
        ├── requirements.txt       # FastAPI & Uvicorn dependencies
        └── main.py                # Productivity velocity & burnout score endpoints
```

---

## ⚙️ Prerequisites & Configuration

Before running the services, ensure you have the following installed:
- **MySQL 8.0+**, **Go 1.21+**, **Python 3.11+**, and **PHP 8.2+** (or Java 17+).

**Environment Setup:**
Rename the provided `.env.example` files in each service directory to `.env` and configure your local credentials:

```bash
# Example .env configuration for core-api
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=premium_task_db
JWT_SECRET=your_super_secret_key
```

---

## 🚀 Local Installation & Execution Guide

### 🐳 One-Click Run (Docker Compose) - Recommended

For a zero-configuration setup, run all microservices, the frontend, and the database simultaneously using Docker:

```bash
docker-compose up --build -d
```

*The frontend will be available at `http://localhost:3000` and all APIs will be internally routed.*

---

### Manual Multi-Service Setup

### 1. Database Setup (MySQL 8.0+)

Import the schema and initial seed data:

```bash
mysql -u root -p < database/schema.sql
```

Default credentials provisioned:
- **Email**: `alex.chen@premiumtask.io`
- **Password**: `Password123!`

---

### 2. High-Performance Real-Time Service (Go)

Ensure Go 1.21+ is installed:

```bash
cd services/realtime-go
go mod tidy
go run main.go
# Listening on http://localhost:8082 (WebSocket: ws://localhost:8082/ws/tasks)
```

---

### 3. Data Analytics Engine (Python FastAPI)

Ensure Python 3.10+ and `virtualenv` are installed:

```bash
cd services/analytics-python
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API Docs available at: http://localhost:8000/docs
```

---

### 4. Core CRUD API (PHP or Java Spring Boot)

#### Option A: PHP Core API
```bash
cd services/core-api-php
# Run using PHP built-in server:
php -S 127.0.0.1:8081 -t .
```

#### Option B: Java Spring Boot API
```bash
cd services/core-api-java
./mvnw clean spring-boot:run
# Listening on http://localhost:8080/api/v1/tasks
```

---

### 5. Frontend Client

Open `frontend/index.html` directly in any modern browser, or serve with a lightweight static server:

```bash
cd frontend
# Using Python:
python -m http.server 3000
# Or using Npx:
npx serve -l 3000
```

---

## 🎨 Design Philosophy & UX Highlights

1. **Apple & Samsung One UI Aesthetics**:
   - Monochromatic Obsidian (`#09090b`) canvas with Titanium Blue (`#0071e3`) for active focus elements.
   - 28px backdrop blur (`backdrop-filter: blur(28px) saturate(180%)`) for authentic frosted glass depth.
   - Pill-shaped interaction controls with mathematically nested border radii.
2. **Fluid 60 FPS Micro-Interactions**:
   - Cubic-bezier spring curves (`cubic-bezier(0.16, 1, 0.3, 1)`) for instant physical feedback.
   - SVG Circular Progress gauge with dynamic stroke-dashoffset transitions.
3. **Enterprise Resilience**:
   - Graceful fallback: the UI seamlessly operates even if a microservice is unreachable, caching operations in browser storage.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author
**Adimas** 
* Informatics Student | Full-Stack Enthusiast
* [LinkedIn](https://linkedin.com/in/username-anda) | [Portfolio](https://domain-anda.com)

