const api = "https://your-render-service.onrender.com/students";


const form = document.getElementById('student-form');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const courseInput = document.getElementById('course');
const studentsTableBody = document.querySelector('#students-table tbody');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit');
const studentIdInput = document.getElementById('student-id');

function showMessage(msg, isError=true) {
  messageDiv.textContent = msg;
  messageDiv.style.color = isError ? '#d8000c' : 'green';
  if (msg) setTimeout(() => { messageDiv.textContent = '' }, 3000);
}

function validateForm(name, age, course) {
  if (!name || !name.trim()) return 'Name cannot be empty';
  if (age === '' || age === null || isNaN(Number(age))) return 'Age must be a number';
  if (!course || !course.trim()) return 'Course cannot be empty';
  return null;
}

async function fetchStudents() {
  try {
    const res = await fetch(API_BASE);
    const data = await res.json();
    renderTable(data);
  } catch (err) {
    showMessage('Could not fetch students. Make sure backend is running.');
  }
}

function renderTable(students) {
  studentsTableBody.innerHTML = '';
  for (const s of students) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(s.name)}</td>
      <td>${s.age}</td>
      <td>${escapeHtml(s.course)}</td>
      <td class="actions-cell">
        <button data-id="${s.id}" class="edit-btn">Edit</button>
        <button data-id="${s.id}" class="delete-btn">Delete</button>
      </td>
    `;
    studentsTableBody.appendChild(tr);
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, function(m) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = studentIdInput.value;
  const name = nameInput.value;
  const age = ageInput.value;
  const course = courseInput.value;

  const err = validateForm(name, age, course);
  if (err) {
    showMessage(err);
    return;
  }

  const payload = { name: name.trim(), age: Number(age), course: course.trim() };

  try {
    if (id) {
      // update
      const res = await fetch(API_BASE + '/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Failed to update');
      }
      showMessage('Student updated', false);
    } else {
      // create
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.status !== 201) {
        const body = await res.json();
        throw new Error(body.error || 'Failed to create');
      }
      showMessage('Student added', false);
    }
    resetForm();
    fetchStudents();
  } catch (err) {
    showMessage(err.message || 'Request failed');
  }
});

studentsTableBody.addEventListener('click', async (e) => {
  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.dataset.id;
    startEdit(id);
  } else if (e.target.classList.contains('delete-btn')) {
    const id = e.target.dataset.id;
    if (!confirm('Delete this student?')) return;
    try {
      const res = await fetch(API_BASE + '/' + id, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Failed to delete');
      }
      showMessage('Deleted', false);
      fetchStudents();
    } catch (err) {
      showMessage(err.message || 'Delete failed');
    }
  }
});

async function startEdit(id) {
  try {
    const res = await fetch(API_BASE);
    const students = await res.json();
    const s = students.find(x => x.id === id);
    if (!s) {
      showMessage('Student not found');
      return;
    }
    studentIdInput.value = s.id;
    nameInput.value = s.name;
    ageInput.value = s.age;
    courseInput.value = s.course;
    submitBtn.textContent = 'Update Student';
    cancelEditBtn.classList.remove('hidden');
  } catch (err) {
    showMessage('Could not fetch student for edit');
  }
}

cancelEditBtn.addEventListener('click', (e) => {
  resetForm();
});

function resetForm() {
  studentIdInput.value = '';
  nameInput.value = '';
  ageInput.value = '';
  courseInput.value = '';
  submitBtn.textContent = 'Add Student';
  cancelEditBtn.classList.add('hidden');
}

window.addEventListener('DOMContentLoaded', () => {
  fetchStudents();
});
