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
	
@Autowired
private MailService mailService;


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
		 mailService.sendMail(
		            user1.getEmail(),
		            "Login Successful",
		            "Hello " + user1.getName() + ",\n\nYou have successfully logged into your account."
		        );

		return user1;
		
		}else {
			return null;
		}
	}
	@Override
	public UserRegister changepasswordservice(String username, String password) {
	    if (usr.existsByUsername(username)) {
	        UserRegister user1 = usr.findByUsername(username);
	        user1.setPassword(password);
	        UserRegister updatedUser = usr.save(user1);

	        mailService.sendMail(
	            updatedUser.getEmail(),
	            "Password Changed",
	            "Hi " + updatedUser.getName() + ",\n\nYour password has been successfully updated."
	        );

	        return updatedUser;
	    } else {
	        return null;
	    }
	}

	


}
