const api = "http://localhost:5000/students";

const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");

function loadStudents() {
  fetch(api)
    .then((res) => res.json())
    .then((data) => {
      table.innerHTML = "";

      data.forEach((s) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${s.name}</td>
          <td>${s.age}</td>
          <td>${s.course}</td>
          <td>
            <button onclick="editStudent(${s.id})">Edit</button>
            <button onclick="deleteStudent(${s.id})">Delete</button>
          </td>
        `;

        table.appendChild(row);
      });
    })
    .catch(err => {
      table.innerHTML = "<tr><td colspan='4'>Unable to load students (backend may be offline).</td></tr>";
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const course = document.getElementById("course").value.trim();

  if (!name || !age || !course) {
    alert("All fields are required");
    return;
  }

  if (isNaN(age)) {
    alert("Age must be a number");
    return;
  }

  fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, age, course }),
  }).then(() => {
    form.reset();
    loadStudents();
  }).catch(err => alert("Error saving student"));
});

function deleteStudent(id) {
  if (!confirm("Delete this student?")) return;
  fetch(`${api}/${id}`, { method: "DELETE" }).then(() => loadStudents());
}

function editStudent(id) {
  const name = prompt("Enter new name");
  const age = prompt("Enter new age");
  const course = prompt("Enter new course");

  if (!name || !age || !course) return alert("All fields required");
  if (isNaN(age)) return alert("Age must be a number");

  fetch(`${api}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, age, course }),
  }).then(() => loadStudents());
}

// Initial load
loadStudents();
