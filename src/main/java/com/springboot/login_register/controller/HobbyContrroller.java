package com.springboot.login_register.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.login_register.entity.Hobby;
import com.springboot.login_register.entity.ResponseStructure;
import com.springboot.login_register.service.HobbyServiceImplementation;

@RestController
@RequestMapping("/hobby")
public class HobbyContrroller {
	@Autowired
private HobbyServiceImplementation hsi;

	
	@PostMapping("/save")
	public ResponseEntity<ResponseStructure<Hobby>> postHobby(@RequestBody Hobby hobby) {
      Hobby hobby1=hsi.saveHobby(hobby);
      ResponseStructure< Hobby> rs=new ResponseStructure();
      rs.setCode(200);
      rs.setMessage("added");
      rs.setBody(hobby1);
      return new ResponseEntity<>(rs,HttpStatus.OK);
	}
	@GetMapping("/getall")
	public ResponseEntity<ResponseStructure<List<Hobby>>> getAllHobby(@RequestBody Hobby hobby) {
	      List<Hobby >hobby1=hsi.getAll(hobby.getHobbyTag());
	     ResponseStructure <List< Hobby>> rs=new ResponseStructure();
	      rs.setCode(200);
	      rs.setMessage("added");
	      rs.setBody(hobby1);
	      return new ResponseEntity<>(rs,HttpStatus.OK);
		}

	@PutMapping("/change/{hid}")
	public ResponseEntity<ResponseStructure<Hobby>> changes(@RequestBody Hobby hobby,@PathVariable int hid) {
//	     Hobby hobby1=hsi.getAll(hobby.getHobbyTag());
		
		Hobby hobby1=hsi.changeHobby(hobby,hid);
	
	     ResponseStructure < Hobby> rs=new ResponseStructure();
	      rs.setCode(200);
	      rs.setMessage("added");
	      rs.setBody(hobby1);
	      return new ResponseEntity<>(rs,HttpStatus.OK);
		}
	
	 @PostMapping("/saveInUser/{userid}")
	    public ResponseEntity<ResponseStructure<Hobby>> saveHobbyToUser(
	            @RequestBody Hobby hobby,
	            @PathVariable int userid) {

	        Hobby saved = hsi.saveHobbyinUser(hobby, userid);

	        ResponseStructure<Hobby> rs = new ResponseStructure<>();
	        rs.setCode(200);
	        rs.setMessage("Hobby saved and assigned to user.");
	        rs.setBody(saved);

	        return new ResponseEntity<>(rs, HttpStatus.OK);
	    }

}
