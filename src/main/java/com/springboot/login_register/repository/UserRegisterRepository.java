package com.springboot.login_register.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springboot.login_register.entity.UserRegister;

public interface UserRegisterRepository extends JpaRepository<UserRegister, Integer>{
//Boolean existsByUsername(String username);

//Optional<UserRegister> save(Optional<UserRegister> user);

boolean existsByUsername(String username);
boolean existsByPassword(String password);
UserRegister findByUsername(String username);
}
