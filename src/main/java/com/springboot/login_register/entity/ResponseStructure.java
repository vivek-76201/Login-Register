package com.springboot.login_register.entity;

import java.util.Optional;

import org.springframework.stereotype.Component;

@Component
public class ResponseStructure <T>{
private int code;
private String message;
private T body;
public int getCode() {
	return code;
}
public void setCode(int code) {
	this.code = code;
}
public String getMessage() {
	return message;
}
public void setMessage(String message) {
	this.message = message;
}
public T getBody() {
	return body;
}
public void setBody( T body) {
	this.body = body;
}
}
