Student Management System - README

Steps to run locally:

1. Backend
   - Prerequisite: Node.js installed.
   - Open terminal and go to backend folder:
     cd backend
   - Install dependencies:
     npm init -y
     npm install express cors
   - Start server:
     node server.js
   - Backend runs on http://localhost:5000

2. Frontend
   - Open the frontend/index.html in your browser (double-click the file)
   - The frontend communicates with backend at http://localhost:5000
   - Alternatively, serve frontend with a simple static server if needed.

Note: If your TL wants to test without installing:
- They can run backend with Node.js as shown, then open index.html.
- Or use any static file server to serve frontend folder.
