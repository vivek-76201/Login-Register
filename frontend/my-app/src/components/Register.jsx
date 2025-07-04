import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { css } from 'styled-components';

// Styled Components

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 5px;  /* less margin to error msg */
  border: 1.8px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: #0077ff;
    outline: none;
  }

  ${props =>
    props.invalid &&
    css`
      border-color: #d32f2f;
    `}
`;

const ErrorMsgField = styled.p`
  color: #d32f2f;
  font-size: 0.85rem;
  margin: 0 0 15px 5px;
  font-weight: 600;
`;

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

const GeneralErrorMsg = styled.p`
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

  // Store per-field error messages as strings (empty = no error)
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    username: '',
    password: '',
    age: '',
    email: '',
    phone: ''
  });

  // General error for server or submission errors
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  // Validate and set error messages per field
  const validateForm = () => {
    const errors = {
      name: '',
      username: '',
      password: '',
      age: '',
      email: '',
      phone: ''
    };

    if (formData.name.trim().length < 3) errors.name = 'Full name must be at least 3 characters.';
    if (formData.username.trim().length < 3) errors.username = 'Username must be at least 3 characters.';
    if (formData.password.trim().length < 6) errors.password = 'Password must be at least 6 characters.';

    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum)) errors.age = 'Age must be a number.';
    else if (ageNum < 10 || ageNum > 120) errors.age = 'Age must be between 10 and 120.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) errors.email = 'Please enter a valid email address.';

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) errors.phone = 'Phone number must be exactly 10 digits.';

    setFieldErrors(errors);

    // Return true if no error messages
    return Object.values(errors).every(msg => msg === '');
  };

  const handleChange = e => {
    setGeneralError('');
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Reset the error message for this field on change
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      setGeneralError('Please fix the errors below.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/user/save', {
        ...formData,
        age: parseInt(formData.age, 10),
        phone: parseInt(formData.phone, 10)
      });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setGeneralError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Create an Account</Title>
        {generalError && <GeneralErrorMsg>{generalError}</GeneralErrorMsg>}

        <Input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          invalid={!!fieldErrors.name}
          autoComplete="name"
        />
        {fieldErrors.name && <ErrorMsgField>{fieldErrors.name}</ErrorMsgField>}

        <Input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          invalid={!!fieldErrors.username}
          autoComplete="username"
        />
        {fieldErrors.username && <ErrorMsgField>{fieldErrors.username}</ErrorMsgField>}

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          invalid={!!fieldErrors.password}
          autoComplete="new-password"
        />
        {fieldErrors.password && <ErrorMsgField>{fieldErrors.password}</ErrorMsgField>}

        <Input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          invalid={!!fieldErrors.age}
          autoComplete="off"
        />
        {fieldErrors.age && <ErrorMsgField>{fieldErrors.age}</ErrorMsgField>}

        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          invalid={!!fieldErrors.email}
          autoComplete="email"
        />
        {fieldErrors.email && <ErrorMsgField>{fieldErrors.email}</ErrorMsgField>}

        <Input
          type="number"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          invalid={!!fieldErrors.phone}
          autoComplete="tel"
        />
        {fieldErrors.phone && <ErrorMsgField>{fieldErrors.phone}</ErrorMsgField>}

        <Button type="submit">Register</Button>

        <Text>
          Already have an account? <LinkStyled to="/login">Login here</LinkStyled>
        </Text>
      </Form>
    </Container>
  );
}

export default Register;
