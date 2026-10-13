package com.attendance.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.attendance.backend.repository.UserRepository;
import com.attendance.backend.repository.AttendanceRepository;

@RestController
public class HomeController {
    @Autowired private UserRepository userRepo;
    @Autowired private AttendanceRepository attRepo;

    @GetMapping("/")
    public String home() {
        StringBuilder sb = new StringBuilder();
        sb.append("<html><head><title>Attendance Backend</title>");
        sb.append("<style>body{font-family:Arial;margin:20px} h2{text-align:center} .sub{text-align:center;margin-bottom:20px} .container{display:flex;gap:30px;align-items:flex-start} table{border-collapse:collapse} th,td{border:1px solid #000;padding:6px 10px;font-size:14px} th{background:#f2f2f2} .present{color:green;font-weight:bold} .absent{color:red;font-weight:bold}</style>");
        sb.append("</head><body>");
        sb.append("<h2>Attendance System - Backend</h2>");
        sb.append("<div class=sub>Backend Running</div>");
        sb.append("<div class=container>");
        
        // Users Table LEFT
        sb.append("<div><h3>Users (").append(userRepo.count()).append(")</h3>");
        sb.append("<table><tr><th>Email</th><th>Role</th></tr>");
        for(var u : userRepo.findAll()){
            sb.append("<tr><td>").append(u.getEmail()).append("</td><td>").append(u.getRole()).append("</td></tr>");
        }
        sb.append("</table></div>");

        // Attendance Table RIGHT
        sb.append("<div><h3>Attendance (").append(attRepo.count()).append(")</h3>");
        sb.append("<table><tr><th>Student</th><th>Subject</th><th>Status</th><th>Faculty</th><th>Date</th></tr>");
        for(var a : attRepo.findAll()){
            String cls = a.getStatus().equals("Present") ? "present" : "absent";
            sb.append("<tr><td>").append(a.getStudentEmail()).append("</td><td>").append(a.getSubject()).append("</td><td class=").append(cls).append(">").append(a.getStatus()).append("</td><td>").append(a.getFacultyEmail()).append("</td><td>").append(a.getDate()).append("</td></tr>");
        }
        sb.append("</table></div>");
        
        sb.append("</div></body></html>");
        return sb.toString();
    }
}