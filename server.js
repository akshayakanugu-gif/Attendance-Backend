const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

// Database file
const DB_FILE = './database.json';
let db = {
  users: [
    { email: "faculty@gmail.com", password: "1234", role: "Faculty" },
    { email: "akshaya@gmail.com", password: "1234", role: "Student" },
    { email: "rahul@gmail.com", password: "1234", role: "Student" },
    { email: "priya@gmail.com", password: "1234", role: "Student" },
    { email: "ayan@gmail.com", password: "1234", role: "Student" },
    { email: "sneha@gmail.com", password: "1234", role: "Student" }
  ],
  attendance: []
};

// Load existing DB if exists
if (fs.existsSync(DB_FILE)) {
  try {
    const saved = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    if (saved.users && saved.users.length > 0) db.users = saved.users;
    if (saved.attendance) db.attendance = saved.attendance;
  } catch (e) { console.log("No old DB, using fresh"); }
}

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// HOME PAGE - CLEAN, NO 8080 TEXT
app.get('/', (req, res) => {
  const html = `
  <html><head><title>Attendance System - Backend</title></head>
  <body style="font-family: Arial; padding: 20px;">
  <h1 style="text-align:center;">Attendance System - Backend</h1>
  <p style="text-align:center; color:green; font-weight:bold;">Backend Running</p>
  <div style="display:flex; gap:30px; justify-content:center;">
    <div>
      <h3>Users (${db.users.length})</h3>
      <table border="1" cellpadding="8"><tr><th>Email</th><th>Role</th></tr>
      ${db.users.map(u => `<tr><td>${u.email}</td><td>${u.role}</td></tr>`).join('')}
      </table>
    </div>
    <div>
      <h3>Attendance (${db.attendance.length})</h3>
      <table border="1" cellpadding="8"><tr><th>Student</th><th>Subject</th><th>Status</th><th>Faculty</th><th>Date</th></tr>
      ${db.attendance.slice().reverse().slice(0,100).map(a => 
        `<tr><td>${a.studentEmail}</td><td>${a.subject}</td>
        <td style="color:${a.status==='Absent'?'red':'green'}; font-weight:bold;">${a.status}</td>
        <td>${a.byFaculty}</td><td>${a.date} ${a.time}</td></tr>`
      ).join('')}
      </table>
    </div>
  </div>
  </body></html>`;
  res.send(html);
});

app.get('/attendance', (req, res) => res.json(db.attendance));
app.get('/users', (req, res) => res.json(db.users));

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid email or password" });
  res.json(user);
});

// FINAL FIX - Handles both single and array (5 students)
app.post('/attendance', (req, res) => {
  let records = Array.isArray(req.body) ? req.body : [req.body];
  records = records.filter(r => r.studentEmail && r.subject);
  
  if (records.length === 0) {
    return res.status(400).json({ error: "No valid records" });
  }

  records.forEach(record => {
    db.attendance.push({
      studentEmail: record.studentEmail,
      subject: record.subject,
      status: record.status || "Present",
      byFaculty: record.byFaculty || "faculty@gmail.com",
      date: record.date || new Date().toLocaleDateString(),
      time: record.time || new Date().toLocaleTimeString()
    });
  });

  saveDB();
  console.log(`Saved ${records.length} records. Total: ${db.attendance.length}`);
  res.json({ message: "Attendance saved", count: db.attendance.length, saved: records.length });
});

// PORT - CLEAN LOG, NO LOCALHOST:8080 MESSAGE
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Backend Running");
});
