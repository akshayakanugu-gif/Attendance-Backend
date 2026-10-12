const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = './database.json';

// 5 STUDENTS + FACULTY - FIXED
const DEFAULT_USERS = [
  { email: "faculty@gmail.com", password: "1234", role: "Faculty" },
  { email: "akshaya@gmail.com", password: "1234", role: "Student" },
  { email: "rahul@gmail.com", password: "1234", role: "Student" },
  { email: "priya@gmail.com", password: "1234", role: "Student" },
  { email: "ayan@gmail.com", password: "1234", role: "Student" },
  { email: "sneha@gmail.com", password: "1234", role: "Student" },
];

let db = { users: DEFAULT_USERS, attendance: [] };

// Load or create DB
if (fs.existsSync(DB_FILE)) {
  try {
    const saved = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    if (!saved.users || saved.users.length < 6) saved.users = DEFAULT_USERS;
    db = saved;
  } catch(e) { db = { users: DEFAULT_USERS, attendance: [] }; }
} else {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function saveDB(){ fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }

// Backend Homepage - NOW WITH STATUS COLUMN
app.get('/', (req, res) => {
  let html = `<h1 style="text-align:center">Attendance System - Backend Running on 8080</h1>
  <div style="display:flex; gap:40px; justify-content:center">
  <div><h3>Users (${db.users.length})</h3><table border="1" cellpadding="8"><tr><th>Email</th><th>Role</th></tr>`;
  db.users.forEach(u => html += `<tr><td>${u.email}</td><td>${u.role}</td></tr>`);
  html += `</table></div>
  <div><h3>Attendance (${db.attendance.length})</h3><table border="1" cellpadding="8"><tr><th>Student</th><th>Subject</th><th>Status</th><th>By Faculty</th><th>Time</th></tr>`;
  db.attendance.slice().reverse().slice(0,50).forEach(a => {
    let color = (a.status === 'Absent') ? 'red' : 'green';
    html += `<tr><td>${a.studentEmail || a.student || a.email}</td><td>${a.subject}</td><td style="color:${color}; font-weight:bold">${a.status || 'Present'}</td><td>${a.byFaculty || a.faculty || 'faculty@gmail.com'}</td><td>${a.date || ''} ${a.time || ''}</td></tr>`;
  });
  html += `</table></div></div>
  <p style="text-align:center; margin-top:20px">Subjects: DBMS, Java, Computer Networks | Students: akshaya@gmail.com, rahul@gmail.com, priya@gmail.com, ayan@gmail.com, sneha@gmail.com | Faculty: faculty@gmail.com</p>`;
  res.send(html);
});

app.get('/users', (req,res)=> res.json(db.users));

app.post('/login', (req,res)=>{
  const {email, password} = req.body;
  const user = db.users.find(u=> u.email===email && u.password===password);
  if(user) res.json({message:"Login success", user: {email: user.email, role: user.role.toLowerCase()}});
  else res.status(401).json({message:"Invalid credentials"});
});

app.get('/attendance', (req,res)=>{
  const {student} = req.query;
  if(student) res.json(db.attendance.filter(a=> (a.studentEmail||a.student)===student));
  else res.json(db.attendance);
});

app.post('/attendance', (req,res)=>{
  const record = req.body;
  const finalRecord = {
    studentEmail: record.studentEmail || record.student || record.email,
    studentName: record.studentName || record.studentEmail || "Student",
    subject: record.subject || "DBMS",
    byFaculty: record.byFaculty || record.faculty || "faculty@gmail.com",
    date: record.date || new Date().toLocaleDateString(),
    time: record.time || new Date().toLocaleTimeString(),
    status: record.status || "Present"
  };
  db.attendance.push(finalRecord);
  saveDB();
  res.json({message:"Attendance saved", record: finalRecord});
});

app.listen(process.env.PORT||8080, ()=> console.log("Backend Running on http://localhost:8080"));
