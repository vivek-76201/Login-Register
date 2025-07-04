package com.springboot.login_register.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.login_register.entity.UserRegister;
import com.springboot.login_register.repository.UserRegisterRepository;

@Service
public class UserRegisterServiceImplimentation implements UserRegisterService{
@Autowired
	private UserRegisterRepository usr;
	
	@Override
	public List<UserRegister> getAllUser() {
		 List<UserRegister> ur	=usr.findAll();
		return 	ur;
	}

	@Override
	public UserRegister createUser(UserRegister user) {
		// TODO Auto-generated method stub
		
		return usr.save(user);
	}

	@Override
	public UserRegister getuseronly(String usernname, String password) {
		if(usr.existsByUsername(usernname) && usr.existsByPassword(password)) {
		UserRegister user1=usr.findByUsername(usernname);
		return user1;
		}else {
			return null;
		}
	}



}
