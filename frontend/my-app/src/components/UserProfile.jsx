import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 700;
  text-align: center;
`;

const InfoRow = styled.div`
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: #444;
  display: flex;
  align-items: center;
  justify-content: space-between;

  strong {
    color: #0077ff;
    width: 120px;
    flex-shrink: 0;
  }

  input {
    padding: 8px 12px;
    border: 1.5px solid #ccc;
    border-radius: 6px;
    flex: 1;
    margin-left: 10px;
    font-size: 1rem;
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

const SuccessMsg = styled(ErrorMsg)`
  color: green;
`;

// New styled component for similarity score
const ScoreBox = styled.div`
  margin-top: 20px;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 10px 15px;
  border-radius: 8px;
  width: fit-content;
  color: white;
  background-color: ${({ score }) =>
    score > 70 ? "#4caf50" : score > 40 ? "#ff9800" : "#f44336"};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
`;

// Navigation buttons for multiple matches
const NavigationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
`;

const NavButton = styled.button`
  background: #0077ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #005fcc;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const MatchInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

// Helper to calculate simple similarity score based on common words (0-100)
function calculateSimilarityScore(desc1, desc2) {
  if (!desc1 || !desc2) return 0;

  const set1 = new Set(desc1.toLowerCase().split(/\W+/));
  const set2 = new Set(desc2.toLowerCase().split(/\W+/));

  let commonCount = 0;
  for (const word of set1) {
    if (set2.has(word)) commonCount++;
  }

  const avgLength = (set1.size + set2.size) / 2;
  if (avgLength === 0) return 0;

  return Math.round((commonCount / avgLength) * 100);
}

function UserProfile({ user, onLogout, onUserUpdate }) {
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [searchHobbyTag, setSearchHobbyTag] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchedUser, setSearchedUser] = useState(null);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [error, setError] = useState("");
  const [hobby, setHobby] = useState({ description: "", hobbyTag: "" });
  const [hobbyMsg, setHobbyMsg] = useState("");
  const [currentUser, setCurrentUser] = useState(user);
  const suggestionsRef = useRef(null);

  // Load all users on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("http://localhost:8080/user/all");
        if (res.data?.body && Array.isArray(res.data.body)) {
          setAllUsers(res.data.body);
        } else {
          setError("Failed to load user data properly.");
        }
      } catch (err) {
        setError("Failed to load users from server.");
      }
    }
    fetchUsers();
  }, []);

  // Update currentUser when user prop changes
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  // Prefill hobby input when user data changes
  useEffect(() => {
    if (currentUser?.hobby) {
      setHobby({
        description: currentUser.hobby.description || "",
        hobbyTag: currentUser.hobby.hobbyTag || "",
      });
    } else {
      setHobby({ description: "", hobbyTag: "" });
    }
  }, [currentUser]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    setSearchHobbyTag(e.target.value);
    setError("");
  };

  // Update suggestions on hobbyTag input change
  useEffect(() => {
    if (searchHobbyTag.trim() === "") {
      setSuggestions([]);
      setSearchedUser(null);
      setMatchedUsers([]);
      setCurrentMatchIndex(0);
      setError("");
      return;
    }
    const filtered = allUsers.filter(
      (u) =>
        u.hobby?.hobbyTag &&
        typeof u.hobby.hobbyTag === "string" &&
        u.hobby.hobbyTag.toLowerCase().startsWith(searchHobbyTag.trim().toLowerCase()) &&
        u.id !== currentUser?.id
    );
    setSuggestions(filtered);
  }, [searchHobbyTag, allUsers, currentUser]);

  const handleSuggestionClick = (hobbyTag) => {
    const usersFound = allUsers.filter(
      (u) => u.hobby?.hobbyTag === hobbyTag && u.id !== currentUser?.id
    );
    if (usersFound.length > 0) {
      setMatchedUsers(usersFound);
      setCurrentMatchIndex(0);
      setSearchedUser(usersFound[0]);
      setSearchHobbyTag(hobbyTag);
      setSuggestions([]);
      setError("");
    } else {
      setError("User with this hobby not found.");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchHobbyTag.trim()) {
      setSearchedUser(null);
      setMatchedUsers([]);
      setCurrentMatchIndex(0);
      setError("");
      return;
    }
    const usersFound = allUsers.filter(
      (u) =>
        u.hobby?.hobbyTag &&
        typeof u.hobby.hobbyTag === "string" &&
        u.hobby.hobbyTag.toLowerCase() === searchHobbyTag.trim().toLowerCase() &&
        u.id !== currentUser?.id
    );
    if (usersFound.length > 0) {
      setMatchedUsers(usersFound);
      setCurrentMatchIndex(0);
      setSearchedUser(usersFound[0]);
      setError("");
      setSuggestions([]);
    } else {
      setSearchedUser(null);
      setMatchedUsers([]);
      setCurrentMatchIndex(0);
      setError("User with this hobby not found.");
      setSuggestions([]);
    }
  };

  const handleSaveHobby = async () => {
    if (!hobby.description || !hobby.hobbyTag) {
      setHobbyMsg("Please fill out both fields.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8080/hobby/saveInUser/${currentUser.id}`,
        hobby
      );

      if (res.data?.body) {
        const updatedUser = { ...currentUser, hobby: res.data.body };
        setCurrentUser(updatedUser);
        setHobbyMsg(`Hobby ${hasExistingHobby ? 'updated' : 'added'} successfully!`);
        
        // Clear the form after successful save
        setHobby({ description: "", hobbyTag: "" });
        
        // Update parent component if callback exists
        if (typeof onUserUpdate === "function") {
          onUserUpdate(updatedUser);
        }
      } else {
        setHobbyMsg("Something went wrong.");
      }
    } catch (err) {
      setHobbyMsg("Failed to save hobby.");
    }
  };

  const handleNextMatch = () => {
    if (currentMatchIndex < matchedUsers.length - 1) {
      const nextIndex = currentMatchIndex + 1;
      setCurrentMatchIndex(nextIndex);
      setSearchedUser(matchedUsers[nextIndex]);
    }
  };

  const handlePreviousMatch = () => {
    if (currentMatchIndex > 0) {
      const prevIndex = currentMatchIndex - 1;
      setCurrentMatchIndex(prevIndex);
      setSearchedUser(matchedUsers[prevIndex]);
    }
  };

  // Check if user has existing hobby
  const hasExistingHobby = currentUser?.hobby?.description && currentUser?.hobby?.hobbyTag;

  // Calculate similarity score between current user's hobby description and searched user's
  const similarityScore = calculateSimilarityScore(
    currentUser?.hobby?.description || "",
    searchedUser?.hobby?.description || ""
  );

  return (
    <Container>
      <SearchBox ref={suggestionsRef}>
        <form onSubmit={handleSearchSubmit} autoComplete="off">
          <Input
            type="text"
            placeholder="Search by hobby tag"
            value={searchHobbyTag}
            onChange={handleSearchChange}
            aria-label="Search hobby tag"
            spellCheck="false"
          />
          {suggestions.length > 0 && (
            <SuggestionsList>
              {suggestions.map((sugg) => (
                <SuggestionItem
                  key={sugg.hobby.hobbyTag}
                  onClick={() => handleSuggestionClick(sugg.hobby.hobbyTag)}
                >
                  {sugg.hobby.hobbyTag}
                </SuggestionItem>
              ))}
            </SuggestionsList>
          )}
          <Button type="submit">Search</Button>
        </form>
        {error && <ErrorMsg>{error}</ErrorMsg>}
      </SearchBox>

      <ProfilesWrapper>
        <Card>
          <Title>Your Profile</Title>
          <InfoRow>
            <strong>Name:</strong> {currentUser?.name || "N/A"}
          </InfoRow>
          <InfoRow>
            <strong>Username:</strong> {currentUser?.username || "N/A"}
          </InfoRow>
          <InfoRow>
            <strong>Email:</strong> {currentUser?.email || "N/A"}
          </InfoRow>
          <InfoRow>
            <strong>Age:</strong> {currentUser?.age || "N/A"}
          </InfoRow>
          <InfoRow>
            <strong>Phone:</strong> {currentUser?.phone || "N/A"}
          </InfoRow>

          {currentUser?.hobby && (
            <>
              <InfoRow>
                <strong>Hobby Tag:</strong> {currentUser.hobby.hobbyTag}
              </InfoRow>
              <InfoRow>
                <strong>Description:</strong> {currentUser.hobby.description}
              </InfoRow>
            </>
          )}

          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>

          <hr style={{ margin: "30px 0", borderColor: "#eee" }} />
          <Title style={{ fontSize: "1.3rem", marginBottom: "15px" }}>
            {hasExistingHobby ? 'Edit Hobby' : 'Add Hobby'}
          </Title>

          <InfoRow>
            <strong>Description:</strong>
            <input
              type="text"
              value={hobby.description}
              onChange={(e) => setHobby({ ...hobby, description: e.target.value })}
              placeholder={hasExistingHobby ? "Edit description" : "Enter description"}
            />
          </InfoRow>
          <InfoRow>
            <strong>Hobby Tag:</strong>
            <input
              type="text"
              value={hobby.hobbyTag}
              onChange={(e) => setHobby({ ...hobby, hobbyTag: e.target.value })}
              placeholder={hasExistingHobby ? "Edit hobby tag" : "Enter hobby tag"}
            />
          </InfoRow>
          <Button onClick={handleSaveHobby}>
            {hasExistingHobby ? 'Update Hobby' : 'Add Hobby'}
          </Button>
          {hobbyMsg && <SuccessMsg>{hobbyMsg}</SuccessMsg>}
        </Card>

        {searchedUser && (
          <Card>
            <Title>
              Searched User Profile
              {matchedUsers.length > 1 && (
                <div style={{ fontSize: '0.8rem', fontWeight: 'normal', marginTop: '5px' }}>
                  Profile {currentMatchIndex + 1} of {matchedUsers.length}
                </div>
              )}
            </Title>
            <InfoRow>
              <strong>Name:</strong> {searchedUser.name || "N/A"}
            </InfoRow>
            <InfoRow>
              <strong>Username:</strong> {searchedUser.username || "N/A"}
            </InfoRow>
            <InfoRow>
              <strong>Email:</strong> {searchedUser.email || "N/A"}
            </InfoRow>
            <InfoRow>
              <strong>Age:</strong> {searchedUser.age || "N/A"}
            </InfoRow>
            <InfoRow>
              <strong>Phone:</strong> {searchedUser.phone || "N/A"}
            </InfoRow>
            {searchedUser.hobby && (
              <>
                <InfoRow>
                  <strong>Hobby Tag:</strong> {searchedUser.hobby.hobbyTag}
                </InfoRow>
                <InfoRow>
                  <strong>Description:</strong> {searchedUser.hobby.description}
                </InfoRow>
                <ScoreBox score={similarityScore}>
                  Profile Match Score: {similarityScore} / 100
                </ScoreBox>
              </>
            )}
            
            {matchedUsers.length > 1 && (
              <NavigationWrapper>
                <NavButton 
                  onClick={handlePreviousMatch}
                  disabled={currentMatchIndex === 0}
                >
                  ← Previous
                </NavButton>
                <MatchInfo>
                  {currentMatchIndex + 1} of {matchedUsers.length} matches
                </MatchInfo>
                <NavButton 
                  onClick={handleNextMatch}
                  disabled={currentMatchIndex === matchedUsers.length - 1}
                >
                  Next →
                </NavButton>
              </NavigationWrapper>
            )}
          </Card>
        )}
      </ProfilesWrapper>
    </Container>
  );
}

export default UserProfile;   