import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentID: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.studentID || !formData.password) {
      return alert("Please fill in all required fields!");
    }

    try {
      const res = await axios.post('http://localhost:4000/register', formData, { withCredentials: true });
      setUser(res.data.user);
      navigate('/feed', { replace: true });
      alert("✅ Account created successfully! Welcome to Campus Connect 🎉");
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
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
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>Join Campus Connect</h1>
          <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.95 }}>
            Create your student profile
          </p>
        </div>

        {/* Register Form */}
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1b5e20' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1b5e20' }}>
                School Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@university.edu"
                required
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1b5e20' }}>
                Student ID / Matric Number *
              </label>
              <input
                type="text"
                name="studentID"
                value={formData.studentID}
                onChange={handleChange}
                placeholder="e.g. 23/03sen027"
                required
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1b5e20' }}>
                Create Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd' }}
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
              Create My Account
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
            Already have an account? <a href="/login" style={{ color: '#1b5e20', fontWeight: 'bold' }}>Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;