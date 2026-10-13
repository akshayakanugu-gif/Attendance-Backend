package com.attendance.backend.repository;
import com.attendance.backend.model.Attendance; 
import org.springframework.data.jpa.repository.JpaRepository;
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {}