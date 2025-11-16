Student Management System
=========================

Structure:
/backend - Express server (server.js), package.json, students.json
/frontend - index.html, styles.css, script.js

How to run locally:

1. Start backend:
   cd backend
   npm install
   npm start
   -> Server listens on http://localhost:3000

2. Open frontend:
   Open frontend/index.html in your browser (double-click or use Live Server)
   The frontend talks to http://localhost:3000/api/students

Notes:
- Backend uses a simple students.json file to persist data.
- API endpoints:
  GET  /api/students
  POST /api/students
  PUT  /api/students/:id
  DELETE /api/students/:id

This bundle was generated and packaged into a zip file for download.
