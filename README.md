# MERN DevOps Starter

A deliberately simple MERN-style frontend + Express backend starter for learning DevOps.

## Structure
- frontend: React + Vite
- backend: Node.js + Express API using MVC architecture
- MongoDB: MongoDB Atlas database configured through `backend/.env`

## Backend MVC structure
- `src/config/database.js`: MongoDB connection and collection access
- `src/models/taskModel.js`: task persistence operations
- `src/controllers/taskController.js`: task request validation and responses
- `src/routes/taskRoutes.js`: task endpoint definitions
- `src/app.js`: Express middleware and route registration
- `src/server.js`: database connection and HTTP server startup

## Task API
- `POST /api/tasks`: create a task with `title` and optional `completed`
- `GET /api/tasks`: get all tasks
- `GET /api/tasks/:id`: get one task
- `PUT /api/tasks/:id`: update `title` and/or `completed`
- `DELETE /api/tasks/:id`: delete a task

## Run locally
### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev

The frontend expects the API at http://localhost:5000.
