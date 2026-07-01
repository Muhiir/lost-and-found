import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import LostFound from './pages/LostFound';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    axios.get(`${API_URL}/me`, { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, [location.pathname]);

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  return (
    <>
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/lost-found" element={<LostFound />} />
        <Route path="/feed" element={user ? <Feed user={user} /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;