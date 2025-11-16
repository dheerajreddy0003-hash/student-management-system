const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const DATA_FILE = "students.json";

function loadStudents() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (e) {
    return [];
  }
}

function saveStudents(students) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
}

app.get("/students", (req, res) => {
  const students = loadStudents();
  res.status(200).json(students);
});

app.post("/students", (req, res) => {
  const { name, age, course } = req.body;
  if (!name || !age || !course) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (isNaN(age)) {
    return res.status(400).json({ error: "Age must be a number" });
  }
  const students = loadStudents();
  const newStudent = { id: Date.now(), name, age, course };
  students.push(newStudent);
  saveStudents(students);
  res.status(200).json(newStudent);
});

app.put("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, age, course } = req.body;
  const students = loadStudents();
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: "Student not found" });
  if (!name || !age || !course) return res.status(400).json({ error: "All fields are required" });
  if (isNaN(age)) return res.status(400).json({ error: "Age must be a number" });
  students[index] = { id, name, age, course };
  saveStudents(students);
  res.status(200).json(students[index]);
});

app.delete("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let students = loadStudents();
  const exists = students.some(s => s.id === id);
  if (!exists) return res.status(404).json({ error: "Student not found" });
  students = students.filter(s => s.id !== id);
  saveStudents(students);
  res.status(200).json({ message: "Student deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
