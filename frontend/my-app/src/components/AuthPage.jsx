import React, { useState } from 'react';
import styled from 'styled-components';
import Register from './Register';
import Login from './Login';

const Wrapper = styled.div`
  max-width: 520px;
  margin: 60px auto;
  border-radius: 15px;
  box-shadow: 0 14px 35px rgba(0,0,0,0.1);
  background: #ffffff;
  padding: 10px;

  @media (max-width: 576px) {
    margin: 30px 10px;
  }
`;

const ToggleButtons = styled.div`
  display: flex;
  margin-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 14px 0;
  cursor: pointer;
  border: none;
  background-color: ${({ active }) => (active ? '#007bff' : 'transparent')};
  color: ${({ active }) => (active ? '#fff' : '#555')};
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: ${({ active }) => (active ? '12px 12px 0 0' : '0')};
  transition: background-color 0.3s, color 0.3s;

  &:hover:not(:disabled) {
    background-color: #0056b3;
    color: #fff;
  }
`;

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Wrapper>
      <ToggleButtons>
        <ToggleButton active={isLogin} onClick={() => setIsLogin(true)}>
          Login
        </ToggleButton>
        <ToggleButton active={!isLogin} onClick={() => setIsLogin(false)}>
          Register
        </ToggleButton>
      </ToggleButtons>

      {isLogin ? <Login /> : <Register />}
    </Wrapper>
  );
}

export default AuthPage;
