import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styled, { css } from 'styled-components';

// Styled Components

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
  max-width: 400px;
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
  margin-bottom: 5px; /* less margin to error msg */
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

const SuccessMsg = styled.p`
  color: green;
  margin-bottom: 15px;
  font-weight: 600;
  text-align: center;
`;

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [forgotMode, setForgotMode] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState('');
  // Store per-field error messages
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  // Validate form and return true if valid, else set fieldErrors
  const validateForm = () => {
    const errors = { username: '', password: '' };

    if (formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters.';
    }

    if (formData.password.trim().length < 6) {
      errors.password = forgotMode
        ? 'New password must be at least 6 characters.'
        : 'Password must be at least 6 characters.';
    }

    setFieldErrors(errors);

    return Object.values(errors).every(msg => msg === '');
  };

  const handleChange = e => {
    setGeneralError('');
    setSuccess('');
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear the specific field error on change
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      setGeneralError('Please fix the errors below.');
      return;
    }

    try {
      if (forgotMode) {
        // Change password
        await axios.put('http://localhost:8080/user/changepassword', formData);
        setSuccess('Password changed successfully. Please log in.');
        setFormData({ username: '', password: '' });
        setForgotMode(false);
      } else {
        // Login
        const res = await axios.post('http://localhost:8080/user/login', formData);
        localStorage.setItem('loggedInUser', JSON.stringify(res.data.body));
        onLoginSuccess(res.data.body);
        navigate('/profile');
      }
    } catch (err) {
      setGeneralError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>{forgotMode ? 'Reset Your Password' : 'Login to Your Account'}</Title>

        {generalError && <GeneralErrorMsg>{generalError}</GeneralErrorMsg>}
        {success && <SuccessMsg>{success}</SuccessMsg>}

        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
          required
          invalid={!!fieldErrors.username}
        />
        {fieldErrors.username && <ErrorMsgField>{fieldErrors.username}</ErrorMsgField>}

        <Input
          type="password"
          name="password"
          placeholder={forgotMode ? 'New Password' : 'Password'}
          value={formData.password}
          onChange={handleChange}
          autoComplete={forgotMode ? 'new-password' : 'current-password'}
          required
          invalid={!!fieldErrors.password}
        />
        {fieldErrors.password && <ErrorMsgField>{fieldErrors.password}</ErrorMsgField>}

        <Button type="submit">{forgotMode ? 'Change Password' : 'Login'}</Button>

        <Text>
          {forgotMode ? (
            <>
              Remembered your password?{' '}
              <LinkStyled onClick={() => setForgotMode(false)}>Login</LinkStyled>
            </>
          ) : (
            <>
              <LinkStyled onClick={() => setForgotMode(true)}>Forgot Password?</LinkStyled>
            </>
          )}
        </Text>

        {!forgotMode && (
          <Text>
            Don't have an account? <LinkStyled to="/register">Register</LinkStyled>
          </Text>
        )}
      </Form>
    </Container>
  );
}

export default Login;
