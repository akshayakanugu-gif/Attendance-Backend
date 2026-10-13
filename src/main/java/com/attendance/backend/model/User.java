package com.attendance.backend.model;
import jakarta.persistence.*;
@Entity @Table(name="users")
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private String email; 
 private String password;
  private String role;
 public Long getId(){
    return id;
} public void setId(Long id){
        this.id=id;
    }
 public String getEmail(){
    return email;
} public void setEmail(String e){
    this.email=e;
}
 public String getPassword(){
    return password;
 } 
 public void setPassword(String p){
    this.password=p;
}
 public String getRole(){
    return role;
} public void setRole(String r){
    this.role=r;
}
}