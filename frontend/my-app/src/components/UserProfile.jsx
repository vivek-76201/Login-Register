import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  background: #f0f4f8;
  min-height: 100vh;
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchBox = styled.div`
  width: 450px;
  max-width: 100%;
  margin-bottom: 40px;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1.8px solid #ccc;
  box-sizing: border-box;

  &:focus {
    border-color: #0077ff;
    outline: none;
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 45px;
  left: 0;
  right: 0;
  background: white;
  border: 1.8px solid #ccc;
  border-top: none;
  max-height: 150px;
  overflow-y: auto;
  border-radius: 0 0 8px 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 10;
`;

const SuggestionItem = styled.li`
  padding: 10px 15px;
  cursor: pointer;
  &:hover {
    background-color: #f0f4f8;
  }
`;

const Button = styled.button`
  margin-top: 15px;
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

const ProfilesWrapper = styled.div`
  display: flex;
  gap: 30px;
  max-width: 960px;
  width: 100%;
  justify-content: center;

  @media (max-width: 960px) {
    flex-direction: column;
    align-items: center;
  }
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

const ErrorMsg = styled.p`
  color: #d32f2f;
  font-weight: 600;
  text-align: center;
  margin-top: 10px;
`;

function UserProfile({ user, onLogout }) {
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchedUser, setSearchedUser] = useState(null);
  const [error, setError] = useState('');
  const suggestionsRef = useRef(null);

  // Fetch all users on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get('http://localhost:8080/user/all');
        if (res.data && res.data.body && Array.isArray(res.data.body)) {
          setAllUsers(res.data.body);
        } else {
          setError('Failed to load user data properly.');
        }
      } catch (err) {
        setError('Failed to load users from server.');
      }
    }
    fetchUsers();
  }, []);

  // Handle click outside suggestions to close dropdown
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleSearchChange = e => {
    setSearchUsername(e.target.value);
    setError('');
  };

  // Update suggestions as user types
  useEffect(() => {
    if (searchUsername.trim() === '') {
      setSuggestions([]);
      setSearchedUser(null);
      setError('');
      return;
    }

    const filtered = allUsers.filter(
      u =>
        u.username &&
        typeof u.username === 'string' &&
        u.username.toLowerCase().startsWith(searchUsername.trim().toLowerCase())
    );
    setSuggestions(filtered);
  }, [searchUsername, allUsers]);

  const handleSuggestionClick = username => {
    const userFound = allUsers.find(u => u.username === username);
    if (userFound) {
      setSearchedUser(userFound);
      setSearchUsername(username);
      setSuggestions([]);
      setError('');
    } else {
      setError('User not found.');
    }
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (!searchUsername.trim()) {
      setSearchedUser(null);
      setError('');
      return;
    }
    const userFound = allUsers.find(
      u =>
        u.username &&
        typeof u.username === 'string' &&
        u.username.toLowerCase() === searchUsername.trim().toLowerCase()
    );
    if (userFound) {
      setSearchedUser(userFound);
      setError('');
      setSuggestions([]);
    } else {
      setSearchedUser(null);
      setError('User not found.');
      setSuggestions([]);
    }
  };

  return (
    <Container>
      <SearchBox ref={suggestionsRef}>
        <form onSubmit={handleSearchSubmit} autoComplete="off">
          <Input
            type="text"
            placeholder="Search by username"
            value={searchUsername}
            onChange={handleSearchChange}
            aria-label="Search username"
            spellCheck="false"
          />
          {suggestions.length > 0 && (
            <SuggestionsList>
              {suggestions.map(sugg => (
                <SuggestionItem
                  key={sugg.username}
                  onClick={() => handleSuggestionClick(sugg.username)}
                >
                  {sugg.username}
                </SuggestionItem>
              ))}
            </SuggestionsList>
          )}
          <Button type="submit">Search</Button>
        </form>
        {error && <ErrorMsg>{error}</ErrorMsg>}
      </SearchBox>

      <ProfilesWrapper>
        {/* Signed-in user profile */}
        <Card>
          <Title>Your Profile</Title>
          <InfoRow>
            <strong>Name:</strong> {user?.name || 'N/A'}
          </InfoRow>
          <InfoRow>
            <strong>Username:</strong> {user?.username || 'N/A'}
          </InfoRow>
          <InfoRow>
            <strong>Email:</strong> {user?.email || 'N/A'}
          </InfoRow>
          <InfoRow>
            <strong>Age:</strong> {user?.age || 'N/A'}
          </InfoRow>
          <InfoRow>
            <strong>Phone:</strong> {user?.phone || 'N/A'}
          </InfoRow>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </Card>

        {/* Searched user profile (if any) */}
        {searchedUser && (
          <Card>
            <Title>Searched User Profile</Title>
            <InfoRow>
              <strong>Name:</strong> {searchedUser.name || 'N/A'}
            </InfoRow>
            <InfoRow>
              <strong>Username:</strong> {searchedUser.username || 'N/A'}
            </InfoRow>
            <InfoRow>
              <strong>Email:</strong> {searchedUser.email || 'N/A'}
            </InfoRow>
            <InfoRow>
              <strong>Age:</strong> {searchedUser.age || 'N/A'}
            </InfoRow>
            <InfoRow>
              <strong>Phone:</strong> {searchedUser.phone || 'N/A'}
            </InfoRow>
          </Card>
        )}
      </ProfilesWrapper>
    </Container>
  );
}

export default UserProfile;
