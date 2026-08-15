# Ecommerce Application with Docker and MySQL

A full-stack ecommerce application with a React frontend, Node.js/Express backend, and a MySQL database, deployed using Docker.

## Features

- **Frontend**: React.js with Vite (fast build tool and development server)
- **Backend**: Node.js & Express
- **Database**: MySQL
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker
- Docker Compose

## Getting Started

### 1. Build the Images

Navigate to the project root and run:

```bash
docker-compose build
```

### 2. Start the Application

```bash
docker-compose up
```

### 3. Stop the Application

```bash
docker-compose down
```

## Project Structure

```
ecommerce/
├── backend/          # Node.js/Express backend
├── frontend/         # React frontend
└── docker-compose.yml  # Docker Compose configuration
```
