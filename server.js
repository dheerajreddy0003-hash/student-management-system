const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, 'students.json');

function readData() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/students - return all students
app.get('/api/students', (req, res) => {
  const students = readData();
  res.status(200).json(students);
});

// POST /api/students - add student
app.post('/api/students', (req, res) => {
  const { name, age, course } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (age === undefined || isNaN(Number(age))) {
    return res.status(400).json({ error: 'Age must be a number' });
  }
  if (!course || typeof course !== 'string' || !course.trim()) {
    return res.status(400).json({ error: 'Course is required' });
  }

  const students = readData();
  const newStudent = {
    id: uuidv4(),
    name: name.trim(),
    age: Number(age),
    course: course.trim(),
    createdAt: new Date().toISOString()
  };
  students.push(newStudent);
  writeData(students);
  res.status(201).json(newStudent);
});

// PUT /api/students/:id - update student
app.put('/api/students/:id', (req, res) => {
  const id = req.params.id;
  const { name, age, course } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (age === undefined || isNaN(Number(age))) {
    return res.status(400).json({ error: 'Age must be a number' });
  }
  if (!course || typeof course !== 'string' || !course.trim()) {
    return res.status(400).json({ error: 'Course is required' });
  }

  const students = readData();
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  students[idx] = {
    ...students[idx],
    name: name.trim(),
    age: Number(age),
    course: course.trim(),
    updatedAt: new Date().toISOString()
  };
  writeData(students);
  res.status(200).json(students[idx]);
});

// DELETE /api/students/:id - delete student
app.delete('/api/students/:id', (req, res) => {
  const id = req.params.id;
  const students = readData();
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  const removed = students.splice(idx, 1)[0];
  writeData(students);
  res.status(200).json({ message: 'Deleted', student: removed });
});

// Health check
app.get('/', (req, res) => {
  res.send('Student Management API is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
