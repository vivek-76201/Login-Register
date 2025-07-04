import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const RequireAuth = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/profile" : "/login"} />} />
        <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login onLoginSuccess={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/profile" /> : <Register />} />
        <Route path="/profile" element={<RequireAuth><UserProfile user={user} onLogout={() => {
          setUser(null);
          localStorage.removeItem('loggedInUser');
        }} /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
