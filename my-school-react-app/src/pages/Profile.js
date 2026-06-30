import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentID: '',
    phone: '',
    major: '',
    year: 'First Year'
  });

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [messageText, setMessageText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    const fetchProfileAndMessages = async () => {
      try {
        setIsLoadingProfile(true);
        const [profileRes, usersRes, messagesRes] = await Promise.all([
          axios.get(`${API_URL}/me/profile`, { withCredentials: true }),
          axios.get(`${API_URL}/users`, { withCredentials: true }),
          axios.get(`${API_URL}/messages`, { withCredentials: true })
        ]);
        const nextProfile = profileRes.data?.user || null;
        setProfile(nextProfile);
        setUsers(usersRes.data || []);
        setMessages(messagesRes.data || []);
        if (nextProfile) {
          setFormData({
            fullName: nextProfile.fullName || '',
            email: nextProfile.email || '',
            studentID: nextProfile.studentID || '',
            phone: nextProfile.phone || '',
            major: nextProfile.major || '',
            year: nextProfile.year || 'First Year'
          });
        }
      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfileAndMessages();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.studentID) {
      return alert("Please fill in all required fields!");
    }
    try {
      const res = await axios.put(`${API_URL}/me/profile`, formData, { withCredentials: true });
      setProfile(res.data.user);
      setFormData({
        fullName: res.data.user.fullName || '',
        email: res.data.user.email || '',
        studentID: res.data.user.studentID || '',
        phone: res.data.user.phone || '',
        major: res.data.user.major || '',
        year: res.data.user.year || 'First Year'
      });
      setIsEditing(false);
      alert("✅ Profile saved successfully!");
    } catch (err) {
      alert(err.response?.data?.message || 'Profile update failed');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!recipient || !messageText.trim()) {
      return alert('Please select a user and enter a message');
    }

    try {
      setLoadingMessages(true);
      const res = await axios.post(`${API_URL}/messages`, { recipient, content: messageText }, { withCredentials: true });
      setMessages(prev => [res.data.message, ...prev]);
      setMessageText('');
      alert('✅ Message sent');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not send message');
    } finally {
      setLoadingMessages(false);
    }
  };

  return (
    <div style={{
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, #1b5e20, #4caf50)',
          color: 'white',
          padding: '40px 20px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(27, 94, 32, 0.3)'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.8rem' }}>👤 My Profile</h1>
          <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.95 }}>
            Manage your campus identity
          </p>
        </div>

        {isLoadingProfile ? (
          <div style={{ background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', color: '#1b5e20' }}>
            Loading your profile...
          </div>
        ) : isEditing ? (
          /* Edit Form */
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ color: '#1b5e20', marginBottom: '25px' }}>
              {profile ? '✏️ Edit Your Profile' : 'Create Your Profile'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1b5e20' }}>Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1b5e20' }}>School Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1b5e20' }}>Student ID *</label>
                <input type="text" name="studentID" value={formData.studentID} onChange={handleChange} required style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1b5e20' }}>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1b5e20' }}>Major</label>
                <input type="text" name="major" value={formData.major} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd' }} />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1b5e20' }}>Year of Study</label>
                <select name="year" value={formData.year} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd' }}>
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Fourth Year">Fourth Year</option>
                </select>
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
                Save Profile
              </button>
            </form>
          </div>
        ) : (
          /* Profile Display */
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '100px', marginBottom: '15px' }}>👤</div>
              <h2 style={{ color: '#1b5e20' }}>{profile?.fullName || user?.fullName || 'Your Name'}</h2>
              <p style={{ color: '#666' }}>{profile?.email || user?.email || 'your@email.com'}</p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <p><strong>Student ID:</strong> {profile?.studentID || 'Not provided'}</p>
              {profile?.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
              {profile?.major && <p><strong>Major:</strong> {profile.major}</p>}
              <p><strong>Year:</strong> {profile?.year || 'First Year'}</p>
            </div>

            <button 
              onClick={() => setIsEditing(true)}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
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
              ✏️ Edit Profile
            </button>

            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '25px' }}>
              <h3 style={{ color: '#1b5e20', marginBottom: '15px' }}>💬 Message Other Students</h3>
              <form onSubmit={handleSendMessage}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1b5e20' }}>Send to</label>
                  <select value={recipient} onChange={(e) => setRecipient(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}>
                    <option value=''>Choose a student</option>
                    {users.filter(userEntry => userEntry._id !== currentUserId).map(userEntry => (
                      <option key={userEntry._id} value={userEntry._id}>{userEntry.fullName} ({userEntry.email})</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1b5e20' }}>Message</label>
                  <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows='4' placeholder='Type your message here...' style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', resize: 'vertical' }} />
                </div>

                <button type='submit' style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #1b5e20, #4caf50)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                  {loadingMessages ? 'Sending...' : 'Send Message'}
                </button>
              </form>

              <div style={{ marginTop: '20px' }}>
                <h4 style={{ color: '#1b5e20', marginBottom: '10px' }}>Recent Messages</h4>
                {messages.length === 0 ? (
                  <p style={{ color: '#666' }}>No messages yet.</p>
                ) : (
                  messages.map(message => (
                    <div key={message._id} style={{ background: '#f8f8f8', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
                      <strong>{message.sender?.fullName || 'You'}</strong> to <strong>{message.recipient?.fullName || 'them'}</strong>
                      <div style={{ color: '#555', marginTop: '4px' }}>{message.content}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Keyframes for smooth animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Profile;