package com.springboot.login_register.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.login_register.entity.Hobby;
import com.springboot.login_register.entity.UserRegister;
import com.springboot.login_register.repository.HobbyRepository;
import com.springboot.login_register.repository.UserRegisterRepository;

import jakarta.transaction.Transactional;

@Service
public class HobbyServiceImplementation implements HobbyService{

	@Autowired
	private UserRegisterRepository urr;
	@Autowired
	private HobbyRepository hr;
	
	public Hobby saveHobby(Hobby hobby) {
//	Hobby hobby1 =hr.findByHid(hid);
		
		return hr.save(hobby);
	}
	public List<Hobby> getAll(String hobbyTag){
		
		if(hr.existsByHobbyTag(hobbyTag)) {
			List<Hobby >li=hr.findByHobbyTag(hobbyTag);
			return li;
		}else {
			return null;
		}
	}
	@Override
	public Hobby changeHobby(Hobby hobby,int hid) {
		// TODO Auto-generated method stub
		if(hr.existsByHid(hid) ){
			
			Hobby hobby1=hr.findByHid(hid);
			hobby1.setHobbyTag(hobby.getHobbyTag());
			hobby1.setDescription(hobby.getDescription());
			
			return hr.save(hobby1);
		}
		return null;
	}
	 @Transactional
	    @Override
	    public Hobby saveHobbyinUser(Hobby hobby, int userid) {
	        Optional<UserRegister> userOpt = urr.findById(userid);
	        if (userOpt.isEmpty()) {
	            throw new RuntimeException("User not found with id: " + userid);
	        }
	        UserRegister user = userOpt.get();

	        Hobby savedHobby = hr.save(hobby);
	        user.setHobby(savedHobby);
	        urr.save(user);

	        return savedHobby;
	    }

	
}
