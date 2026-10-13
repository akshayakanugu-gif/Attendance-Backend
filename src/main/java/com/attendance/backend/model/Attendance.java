package com.attendance.backend.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
public class Attendance {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String studentEmail; private String subject; private String status;
    private String facultyEmail; private LocalDateTime date;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getStudentEmail(){return studentEmail;} public void setStudentEmail(String s){this.studentEmail=s;}
    public String getSubject(){return subject;} public void setSubject(String s){this.subject=s;}
    public String getStatus(){return status;} public void setStatus(String s){this.status=s;}
    public String getFacultyEmail(){return facultyEmail;} public void setFacultyEmail(String s){this.facultyEmail=s;}
    public LocalDateTime getDate(){return date;} public void setDate(LocalDateTime d){this.date=d;}
}