# AdaptivePractice - AI Smart Question Generator

AdaptivePractice is a full-stack AI-powered adaptive learning platform for students and teachers.

## Features

- JWT authentication for student/teacher roles
- AI-driven MCQ generation with fallback question bank
- Adaptive difficulty progression (easy/medium/hard)
- Persistent student-topic progress across sessions
- Student analytics dashboard:
  - Score history (line chart)
  - Topic-wise accuracy (bar chart)
  - Weak topic detection (last 3 sessions avg < 50%)
  - Activity log and summary stats
- Teacher dashboard:
  - Student performance table
  - Topic performance analytics chart
  - Topic management (add/remove)
- AI-generated question sets are saved in DB for reproducibility

## Tech Stack

- Frontend: React, Tailwind CSS, React Router, Axios, Recharts
- Backend: Node.js, Express.js, JWT, bcryptjs, express-validator
- Database: MongoDB + Mongoose
- AI Layer: OpenAI-compatible endpoint with fallback local question bank

## Project Structure

adaptivepractice/
- client/
  - src/
    - api/
    - components/
    - context/
    - layouts/
    - pages/
- server/
  - config/
  - controllers/
  - middleware/
  - models/
  - routes/
  - services/
  - utils/
- .env
- README.md

## Environment Variables

Root file: .env

- MONGO_URI=your_mongo_uri
- JWT_SECRET=your_jwt_secret
- AI_API_KEY=your_ai_api_key
- AI_PROVIDER=gemini
- AI_MODEL=gemini-1.5-flash
- PORT=5000
- VITE_API_URL=http://localhost:5000/api

## Installation

From project root, install dependencies in both apps:

1. Frontend
   - cd client
   - npm install
2. Backend
   - cd ../server
   - npm install

## Running the App

Single setup from the project root:

- npm install
- npm run dev

This starts both the backend and frontend together during local development.

For Railway single-service deployment:

- Build command: `npm run build`
- Start command: `npm start`
- Set `MONGO_URI`, `JWT_SECRET`, `AI_API_KEY`, `AI_PROVIDER`, and `AI_MODEL`
- Set `VITE_API_URL` to `/api` if you are serving the frontend and backend from the same Railway service

In production, the Express server serves the built React app from `client/dist`.

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Topics
- GET /api/topics
- POST /api/topics (teacher only)
- DELETE /api/topics/:id (teacher only)

### Questions
- POST /api/questions/generate
  - Body: { topic or topicId, difficulty, count }

### Sessions
- POST /api/sessions/start
  - Body: { topicId, count }
- POST /api/sessions/answer
  - Body: { sessionId, questionId, answer }
- POST /api/sessions/submit
  - Body: { sessionId, answers: [{ questionId, answer }] }
- GET /api/sessions/history/:studentId

### Dashboard
- GET /api/dashboard/student/:id
- GET /api/dashboard/teacher

## Adaptive Difficulty Logic

Each student has persistent progress per topic.

- Start at easy
- After a completed session (typically 5 questions):
  - Accuracy >= 80%: move up one level
  - Accuracy 50-79%: stay same level
  - Accuracy < 50%: move down one level

## Notes on AI Integration

- The app attempts AI generation through an OpenAI-compatible chat endpoint.
- If AI generation fails or returns malformed output, fallback questions are used.
- Question sets are always saved to MongoDB (source = ai or fallback).

## Validation and Security

- Input validation with express-validator
- Password hashing with bcryptjs
- JWT token auth with role-based route protection
- Protected frontend routes by role

## Default User Flows

Student:
1. Register/Login as student
2. Select topic
3. Answer adaptive questions one-by-one
4. Get immediate feedback and final session result
5. Review dashboard analytics

Teacher:
1. Register/Login as teacher
2. Open teacher dashboard
3. Add/remove topics
4. Review class analytics and student stats
