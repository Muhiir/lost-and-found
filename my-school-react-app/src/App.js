import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import LostFound from './pages/LostFound';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function Navbar({ user, logout }) {
  return (
    <nav style={{ background: 'linear-gradient(135deg, #1b5e20, #4caf50)', padding: '18px 0', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '28px', fontWeight: 'bold' }}>🏛️ Campus Connect</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
          <Link to="/lost-found" style={{ color: 'white', textDecoration: 'none' }}>Lost & Found</Link>
          <Link to="/feed" style={{ color: 'white', textDecoration: 'none' }}>Campus Feed</Link>
          {user && <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>}
          {user ? (
            <button 
              onClick={logout}
              style={{
                background: '#d32f2f',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

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