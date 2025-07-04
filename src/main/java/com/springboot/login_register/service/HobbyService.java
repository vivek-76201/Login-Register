package com.springboot.login_register.service;

import java.util.List;

import com.springboot.login_register.entity.Hobby;

public interface HobbyService {
Hobby saveHobby(Hobby hobby);
List <Hobby> getAll(String hobbyTag);
Hobby changeHobby(Hobby hobby,int hid);
Hobby saveHobbyinUser(Hobby hobby,int id);
}
