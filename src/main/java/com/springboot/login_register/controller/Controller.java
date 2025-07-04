package com.springboot.login_register.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.login_register.entity.ResponseStructure;
import com.springboot.login_register.entity.UserRegister;
import com.springboot.login_register.service.UserRegisterService;


@RestController
@RequestMapping("/user")
public class Controller {

	@Autowired
	private UserRegisterService urs;
@PostMapping("/save")
public ResponseEntity<ResponseStructure<UserRegister>> postUser(@RequestBody UserRegister user){
    UserRegister savedUser = urs.createUser(user);

    ResponseStructure<UserRegister> rs = new ResponseStructure<>();
	rs.setCode(200);
	rs.setMessage("sucess");
	rs.setBody(savedUser);
	return new ResponseEntity<>(rs,HttpStatus.OK);
	
}
@GetMapping("/all")
public  ResponseEntity<ResponseStructure<List<UserRegister>>> geteveryone(){
	List <UserRegister> user1=urs.getAllUser();
	  ResponseStructure<List<UserRegister>> rs = new ResponseStructure<>();
		rs.setCode(200);
		rs.setMessage("sucess");
		rs.setBody(user1);
		return new ResponseEntity<>(rs,HttpStatus.OK);
}

@PostMapping("/login")
public  ResponseEntity<ResponseStructure<UserRegister>> getOneUSer(@RequestBody UserRegister user){
	
	UserRegister user1=urs.getuseronly(user.getUsername(), user.getPassword());
	  ResponseStructure<UserRegister> rs = new ResponseStructure<>();
		rs.setCode(200);
		rs.setMessage("sucess");
		rs.setBody(user1);
		return new ResponseEntity<>(rs,HttpStatus.OK);
}
@PutMapping("/changepassword")
public ResponseEntity<ResponseStructure<UserRegister>> changePassword(@RequestBody UserRegister user){
	  ResponseStructure<UserRegister> rs = new ResponseStructure<>();
	  UserRegister user1=urs.changepasswordservice(user.getUsername(),user.getPassword());
		rs.setCode(200);
		rs.setMessage("sucess");
		rs.setBody(user1);
		return new ResponseEntity<>(rs,HttpStatus.OK);

	
}
}
