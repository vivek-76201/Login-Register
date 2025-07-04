package com.springboot.login_register.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springboot.login_register.entity.Hobby;

public interface HobbyRepository extends JpaRepository<Hobby, Integer> {
 Hobby findByHid(int hid);
 List<Hobby> findByHobbyTag(String hobbyTag);
 boolean existsByHobbyTag(String hobbyTag);
 boolean existsByHid(int hid);
}
