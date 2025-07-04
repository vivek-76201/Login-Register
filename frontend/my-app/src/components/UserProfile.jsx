import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  background: #f0f4f8;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 50px 20px;
`;

const Card = styled.div`
  background: #fff;
  padding: 40px 35px;
  border-radius: 12px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  width: 100%;
  box-sizing: border-box;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 700;
  text-align: center;
`;

const InfoRow = styled.div`
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: #444;
  strong {
    color: #0077ff;
    width: 110px;
    display: inline-block;
  }
`;

const LogoutButton = styled.button`
  background: #d32f2f;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-weight: 600;
  width: 100%;
  margin-top: 30px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: #9a0000;
  }
`;

function UserProfile({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Container>
      <Card>
        <Title>Your Profile</Title>
        <InfoRow><strong>Name:</strong> {user.name}</InfoRow>
        <InfoRow><strong>Username:</strong> {user.username}</InfoRow>
        <InfoRow><strong>Email:</strong> {user.email}</InfoRow>
        <InfoRow><strong>Age:</strong> {user.age}</InfoRow>
        <InfoRow><strong>Phone:</strong> {user.phone}</InfoRow>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Card>
    </Container>
  );
}

export default UserProfile;
