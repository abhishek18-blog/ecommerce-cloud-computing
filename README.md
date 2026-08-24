# Ecommerce Monolithic App — Containerized (Assignment 2)

A full-stack monolithic ecommerce application containerized using **plain Docker commands** — no Docker Compose.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│               ecommerce-network (bridge)             │
│                                                      │
│  ┌─────────────┐    ┌──────────────────────────┐    │
│  │   MongoDB   │◄───│  Backend (Monolithic)     │    │
│  │  :27017     │    │  Express + Products +     │    │
│  │             │    │  Orders on port :5000     │    │
│  └─────────────┘    └──────────┬───────────────┘    │
│                                │ proxy /api          │
│                     ┌──────────▼───────────┐         │
│                     │  Frontend (React+    │         │
│                     │  Vite) on port :5173 │         │
│                     └──────────────────────┘         │
└─────────────────────────────────────────────────────┘
         ▲
    Browser: http://localhost:5173
```

| Container            | Image               | Port  | Role                          |
|----------------------|---------------------|-------|-------------------------------|
| `ecommerce-mongo`    | `mongo:latest`      | 27017 | Database                      |
| `ecommerce-backend`  | built from backend/ | 5000  | Monolithic API (products+orders) |
| `ecommerce-frontend` | built from frontend/| 5173  | React/Vite UI                 |

---

## Quick Start (One Command)

```bash
chmod +x run.sh stop.sh
./run.sh
```

Then open **http://localhost:5173** in your browser.

To seed sample products:
```bash
docker exec ecommerce-backend node seed.js
```

---

## Manual Step-by-Step Commands (Without Docker Compose)

### Step 1 — Create Docker Bridge Network
```bash
docker network create ecommerce-network
```

### Step 2 — Run MongoDB
```bash
docker run -d \
  --name ecommerce-mongo \
  --network ecommerce-network \
  -v mongo_data:/data/db \
  -p 27017:27017 \
  mongo:latest
```

### Step 3 — Build & Run Backend (Monolithic)
```bash
docker build -t ecommerce-backend ./backend

docker run -d \
  --name ecommerce-backend \
  --network ecommerce-network \
  -e MONGO_URI=mongodb://ecommerce-mongo:27017/ecommerce \
  -e PORT=5000 \
  -p 5000:5000 \
  ecommerce-backend
```

### Step 4 — Build & Run Frontend
```bash
docker build -t ecommerce-frontend ./frontend

docker run -d \
  --name ecommerce-frontend \
  --network ecommerce-network \
  -e VITE_API_URL=http://ecommerce-backend:5000 \
  -p 5173:5173 \
  ecommerce-frontend
```

### Step 5 — Seed the Database
```bash
docker exec ecommerce-backend node seed.js
```

---

## Verify Running Containers

```bash
docker ps --filter "name=ecommerce"
```

Expected output:
```
NAMES                  STATUS          PORTS
ecommerce-frontend     Up X seconds    0.0.0.0:5173->5173/tcp
ecommerce-backend      Up X seconds    0.0.0.0:5000->5000/tcp
ecommerce-mongo        Up X seconds    0.0.0.0:27017->27017/tcp
```

---

## Stop & Clean Up

```bash
./stop.sh
```

Or manually:
```bash
docker rm -f ecommerce-frontend ecommerce-backend ecommerce-mongo
docker network rm ecommerce-network
```

To also remove the database volume:
```bash
docker volume rm mongo_data
```

---

## Monolithic vs Microservices (Assignment 1 vs 2)

| | Assignment 1 (Microservices) | Assignment 2 (Monolithic) |
|---|---|---|
| Backend services | 2 (productService + orderService) | 1 (server.js) |
| Backend ports | 5001, 5002 | 5000 |
| Container orchestration | Docker Compose | Plain `docker run` |
| API routing | Split across services | Single Express app |
| DB connection | 2 connections | 1 connection |
