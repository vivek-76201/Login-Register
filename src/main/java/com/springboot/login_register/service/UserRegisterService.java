package com.springboot.login_register.service;

import java.util.List;
//import java.util.Optional;

//import org.springframework.stereotype.Service;

import com.springboot.login_register.entity.UserRegister;


public interface UserRegisterService {
List <UserRegister> getAllUser();
UserRegister createUser(UserRegister user);
UserRegister getuseronly(String usernname,String password);
UserRegister changepasswordservice(String usernname, String password);

}
