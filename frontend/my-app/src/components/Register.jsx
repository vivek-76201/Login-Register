import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  background: #f0f4f8;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Form = styled.form`
  background: #ffffff;
  padding: 40px 35px;
  border-radius: 12px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: 700;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  border: 1.8px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: #0077ff;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  background: #0077ff;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #005fcc;
  }
`;

const Text = styled.p`
  text-align: center;
  margin-top: 15px;
  font-size: 0.9rem;
  color: #555;
`;

const LinkStyled = styled(Link)`
  color: #0077ff;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMsg = styled.p`
  color: #d32f2f;
  margin-bottom: 15px;
  font-weight: 600;
  text-align: center;
`;

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    age: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setError('');
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (isNaN(formData.age) || isNaN(formData.phone)) {
      setError('Age and Phone must be valid numbers');
      return;
    }

    try {
      await axios.post('http://localhost:8080/user/save', {
        ...formData,
        age: parseInt(formData.age),
        phone: parseInt(formData.phone)
      });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Create an Account</Title>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <Input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <Input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <Input type="number" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        <Button type="submit">Register</Button>
        <Text>
          Already have an account? <LinkStyled to="/login">Login here</LinkStyled>
        </Text>
      </Form>
    </Container>
  );
}

export default Register;
