package com.springboot.login_register.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Hobby {
	  @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int hid;
	public int getHid() {
		return hid;
	}
	public void setHid(int hid) {
		this.hid = hid;
	}
	public String getHobbyTag() {
		return hobbyTag;
	}
	public void setHobbyTag(String hobbytag) {
		this.hobbyTag = hobbytag;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	private String hobbyTag;
	private String description;
}
