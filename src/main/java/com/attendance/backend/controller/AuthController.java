package com.attendance.backend.controller;
import com.attendance.backend.model.Attendance;
import com.attendance.backend.model.User;
import com.attendance.backend.repository.AttendanceRepository;
import com.attendance.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins="*")
public class AuthController {
    private final UserRepository userRepo;
    private final AttendanceRepository attRepo;
    public AuthController(UserRepository userRepo, AttendanceRepository attRepo) {
        this.userRepo=userRepo; this.attRepo=attRepo;
        String[] em={"faculty@gmail.com","akshaya@gmail.com","rahul@gmail.com","priya@gmail.com","ayan@gmail.com","sneha@gmail.com"};
        for(String e:em){ if(userRepo.findByEmail(e).isEmpty()){ User u=new User(); u.setEmail(e); u.setPassword("1234"); u.setRole(e.contains("faculty")?"Faculty":"Student"); userRepo.save(u);} }
    }
    @PostMapping("/login")
    public Map<String,Object> login(@RequestBody Map<String,String> b){ Map<String,Object> r=new HashMap<>(); r.put("success",true); r.put("role", b.get("email").toLowerCase().contains("faculty")?"Faculty":"Student"); return r; }
    @PostMapping("/mark")
    public Map<String,Object> mark(@RequestBody Map<String,Object> b){
        String sub=(String)b.get("subject"); String fac=(String)b.getOrDefault("facultyEmail","faculty@gmail.com");
        List<Map<String,Object>> studs=(List<Map<String,Object>>)b.get("students");
        if(studs!=null) for(var s:studs){ Attendance a=new Attendance(); a.setStudentEmail((String)s.get("email")); a.setSubject(sub); a.setStatus((Boolean)s.get("present")?"Present":"Absent"); a.setFacultyEmail(fac); a.setDate(LocalDateTime.now()); attRepo.save(a); }
        return Map.of("success",true);
    }
    @GetMapping("/records") public List<Attendance> rec(){ 
        return attRepo.findAll(); }
    @GetMapping("/students") public List<User> stu(){ 
        return userRepo.findAll(); }
}