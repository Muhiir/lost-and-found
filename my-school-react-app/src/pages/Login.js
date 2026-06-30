import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill in all fields!");

    try {
      const res = await axios.post('http://localhost:4000/login', { email, password }, { withCredentials: true });
      setUser(res.data.user);
      navigate('/feed', { replace: true });
      alert("✅ Login successful! Welcome back 🎉");
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '450px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, #1b5e20, #4caf50)',
          color: 'white',
          padding: '35px 20px',
          borderRadius: '20px'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>Welcome Back</h1>
          <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.95 }}>
            Sign in to your campus account
          </p>
        </div>

        {/* Login Form */}
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1b5e20' }}>
                School Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@university.edu"
                required
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '10px', 
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1b5e20' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '10px', 
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              />
            </div>

            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #1b5e20, #4caf50)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.03)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Login
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '25px', color: '#666' }}>
            Don't have an account?{' '}
            <a href="/register" style={{ color: '#1b5e20', fontWeight: 'bold' }}>
              Sign Up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;