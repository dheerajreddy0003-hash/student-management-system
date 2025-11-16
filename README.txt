Student Management System

A full-stack CRUD application built for managing student records.
This project includes a Node.js + Express backend and a HTML/CSS/JavaScript frontend.

📁 Project Structure
student-management-system/
│
├── backend/
│   ├── server.js          # Express server with CRUD API
│   ├── package.json       # Dependencies
│   └── students.json      # JSON file used as data storage
│
└── frontend/
    ├── index.html         # Main UI
    ├── styles.css         # Styling
    └── script.js          # Frontend logic + API requests

🚀 How to Run the Project Locally
1️⃣ Start the Backend

Open a terminal and run:

cd backend
npm install
npm start


The backend server will start at:

http://localhost:3000

2️⃣ Start the Frontend

Simply open this file in your browser:

frontend/index.html


(You can double-click the file, or open using VS Code’s Live Server.)

The frontend communicates with:

http://localhost:3000/api/students

🔧 API Endpoints (Backend)
Method	Endpoint	Description
GET	/api/students	Get all students
POST	/api/students	Add a new student
PUT	/api/students/:id	Update an existing student
DELETE	/api/students/:id	Delete a student
📝 Notes

The backend uses students.json as a simple file-based database.

All student records are persisted in this JSON file.

This project was created for educational/assignment purposes.

The project can be deployed using Render (backend) and Vercel or GitHub Pages (frontend).

👨‍💻 Author

Dheeraj Reddy
GitHub: https://github.com/dheerajreddy0003-hash
