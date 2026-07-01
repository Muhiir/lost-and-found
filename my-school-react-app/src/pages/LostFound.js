import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const resolveRecipientValue = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') {
    if (value._id) return String(value._id);
    if (value.id) return String(value.id);
    if (value.email) return String(value.email);
    if (value.studentID) return String(value.studentID);
  }
  return '';
};

function LostFound() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [messageDraft, setMessageDraft] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [formData, setFormData] = useState({
    type: 'lost', title: '', description: '', location: '', category: 'Other', image: ''
  });


  // Fetch items from backend
  useEffect(() => {
    axios.get(`${API_URL}/items`)
      .then(res => {
        setItems(res.data);
        setError('');
      })
      .catch(() => setError('Backend not responding yet'));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return alert("Title and description required!");
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/items`, formData, { withCredentials: true });
      setItems([response.data, ...items]);
      setFormData({ type: 'lost', title: '', description: '', location: '', category: 'Other', image: '' });
      alert("✅ Item posted successfully!");
    } catch (err) {
      setError('Failed to post item');
      alert("❌ Failed to post item");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessage = (item) => {
    setSelectedItem(item);
    setMessageDraft(`Hi! I saw your post about "${item.title}" and wanted to ask about it.`);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedItem || !messageDraft.trim()) return;

    try {
      setSendingMessage(true);
      const recipient = resolveRecipientValue(selectedItem.postedBy || selectedItem.postedByEmail || selectedItem.postedByName || selectedItem.userId || selectedItem.authorId);
      if (!recipient) {
        alert('This post does not have a message recipient available yet.');
        return;
      }

      const res = await axios.post(`${API_URL}/messages`, {
        recipient,
        content: messageDraft.trim()
      }, { withCredentials: true });

      if (res.status === 201) {
        alert('✅ Message sent to the item owner');
        setSelectedItem(null);
        setMessageDraft('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not send message');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="page-shell" style={{
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)',
      minHeight: '100vh'
    }}>
      <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header with animation */}
        <div className="page-header" style={{
          textAlign: 'center',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, #1b5e20, #4caf50)',
          color: 'white',
          padding: '40px 20px',
          borderRadius: '20px',
          animation: 'fadeIn 1s ease-in'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.8rem' }}>🏠 Campus Lost & Found</h1>
          <p style={{ margin: 0, fontSize: '1.3rem', opacity: 0.95 }}>
            Help your fellow students • Find what was lost
          </p>
        </div>

        {/* Post Form */}
        <div className="page-card auth-card" style={{
          background: 'white',
          padding: '35px',
          borderRadius: '20px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
          marginBottom: '50px',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <h3 style={{ color: '#1b5e20', marginBottom: '25px' }}>📝 Post a New Item</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="lf-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <select name="type" value={formData.type} onChange={handleChange} style={{ padding: '14px', borderRadius: '10px', border: '1px solid #ddd' }}>
                <option value="lost">Lost Item</option>
                <option value="found">Found Item</option>
              </select>

              <select name="category" value={formData.category} onChange={handleChange} style={{ padding: '14px', borderRadius: '10px', border: '1px solid #ddd' }}>
                <option value="Electronics">Electronics</option>
                <option value="Bag">Bag / Backpack</option>
                <option value="ID">ID Card / Wallet</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <input type="text" name="title" placeholder="e.g. Black iPhone 13" value={formData.title} onChange={handleChange} required style={{width: '100%', padding: '14px', margin: '15px 0', borderRadius: '10px', border: '1px solid #ddd'}} />

            <textarea name="description" placeholder="Detailed description..." value={formData.description} onChange={handleChange} required style={{width: '100%', padding: '14px', margin: '15px 0', borderRadius: '10px', border: '1px solid #ddd', minHeight: '110px'}} />

            <input type="text" name="location" placeholder="Location (e.g. Library, Block A)" value={formData.location} onChange={handleChange} style={{width: '100%', padding: '14px', margin: '15px 0', borderRadius: '10px', border: '1px solid #ddd'}} />

            <input type="file" onChange={handleImageChange} style={{ margin: '15px 0' }} />

            {formData.image && <img src={formData.image} alt="preview" style={{ maxHeight: '220px', borderRadius: '12px', margin: '15px 0' }} />}

            <button 
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #1b5e20, #4caf50)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => !loading && (e.target.style.transform = 'scale(1.03)')}
              onMouseOut={(e) => !loading && (e.target.style.transform = 'scale(1)')}
            >
              {loading ? 'Posting...' : 'Post Item'}
            </button>
          </form>
        </div>

        {/* Items Grid */}
        <h3 style={{ color: '#1b5e20', marginBottom: '25px' }}>
          {loading ? 'Loading items...' : `Recent Items (${items.length})`}
        </h3>
        {error && <div style={{ padding: '15px', background: '#ffcdd2', color: '#c62828', borderRadius: '10px', marginBottom: '20px' }}>⚠️ {error}</div>}
        <div className="lf-items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {items.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>No items yet. Be the first to post!</p>
          ) : (
            items.map((item, index) => (
              <div 
                key={item._id || item.id || `${item.title || 'item'}-${index}`} 
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer'
                }}
                onClick={() => handleOpenMessage(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                }}
              >
                {item.image && (
                  <img 
                    src={item.image} 
                    alt="item" 
                    style={{ 
                      width: '100%', 
                      height: '210px', 
                      objectFit: 'cover' 
                    }} 
                  />
                )}
                <div style={{ padding: '20px' }}>
                  <span style={{
                    background: item.type === 'lost' ? '#d32f2f' : '#2e7d32',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: '30px',
                    fontSize: '14px'
                  }}>
                    {item.type.toUpperCase()}
                  </span>
                  <h4 style={{ margin: '15px 0 10px 0' }}>{item.title}</h4>
                  <p style={{ color: '#444', lineHeight: '1.5' }}>{item.description}</p>
                  <small style={{ color: '#666' }}>📍 {item.location || 'Not specified'} • {item.date}</small>
                  <div style={{ marginTop: '14px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenMessage(item);
                      }}
                      style={{
                        background: '#1b5e20',
                        color: 'white',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '8px 14px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      💬 Message owner
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '480px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#1b5e20' }}>Message owner</h3>
              <button type="button" onClick={() => setSelectedItem(null)} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <p style={{ margin: '0 0 12px 0', color: '#555' }}>Send a quick message about “{selectedItem.title}”.</p>
            <form onSubmit={handleSendMessage}>
              <textarea
                value={messageDraft}
                onChange={(e) => setMessageDraft(e.target.value)}
                rows={5}
                placeholder="Write your message..."
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setSelectedItem(null)} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={sendingMessage} style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', background: '#1b5e20', color: 'white', cursor: sendingMessage ? 'not-allowed' : 'pointer' }}>
                  {sendingMessage ? 'Sending...' : 'Send message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default LostFound;