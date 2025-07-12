package com.springboot.login_register.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

	@Autowired
	private JavaMailSender jms;
	
	public void sendMail(String to,String subject,String body) {
		
		SimpleMailMessage sm=new SimpleMailMessage();
	 sm.setFrom("vivekchaudhary8237@gmail.com");
	 sm.setTo(to);
	 sm.setSubject(subject);
	 sm.setText(body);
	 
	jms.send(sm);
	}
}
