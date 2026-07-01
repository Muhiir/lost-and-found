import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch posts from backend
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;

    axios.post(`${API_URL}/posts`, {
      content: newPost.content,
      likes: 0
    }, { withCredentials: true })
      .then(res => {
        setPosts([res.data, ...posts]);
        setNewPost({ content: '' });
        alert("✅ Post shared successfully!");
      })
      .catch(err => alert(err.response?.data?.message || "Error posting post"));
  };

  const deletePost = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/posts/${id}`, { withCredentials: true });
      setPosts(posts.filter(post => post._id !== id));
      alert(res.data.message || 'Post deleted');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete post');
    }
  };

  const likePost = async (id) => {
    try {
      const updatedPosts = posts.map(p => 
        p.id === id ? { ...p, likes: p.likes + 1 } : p
      );
      setPosts(updatedPosts);
      // Note: You may want to add an API endpoint to update likes on backend
      // await axios.patch(`${API_URL}/posts/${id}`, { likes: updatedPost.likes });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-shell" style={{
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)',
      minHeight: '100vh'
    }}>
      <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div className="page-header" style={{
          textAlign: 'center',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, #1b5e20, #4caf50)',
          color: 'white',
          padding: '40px 20px',
          borderRadius: '20px'
        }}>
          <h1 style={{ margin: '0 0 10px 0' }}>📰 Campus Social Feed</h1>
          <p style={{ margin: 0, fontSize: '1.3rem' }}>
            Stay connected with your campus community
          </p>
        </div>

        {/* Create Post */}
        <div className="page-card auth-card" style={{
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          marginBottom: '40px'
        }}>
          <h3 style={{ color: '#1b5e20', marginBottom: '20px' }}>✍️ Share something with campus...</h3>
          {error && <div style={{ padding: '10px', background: '#ffcdd2', color: '#c62828', borderRadius: '8px', marginBottom: '15px' }}>⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ content: e.target.value })}
              placeholder="What's happening on campus today?"
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '15px',
                borderRadius: '12px',
                border: '1px solid #ddd',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
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
                marginTop: '15px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => !loading && (e.target.style.transform = 'scale(1.03)')}
              onMouseOut={(e) => !loading && (e.target.style.transform = 'scale(1)')}
            >
              {loading ? 'Posting...' : 'Post to Feed'}
            </button>
          </form>
        </div>

        {/* Posts Feed */}
        <h3 style={{ color: '#1b5e20', marginBottom: '25px' }}>
          {loading ? 'Loading posts...' : 'Latest Posts'}
        </h3>
        
        {posts.map(post => {
          const isOwnPost = Boolean(user && String(post.userId || post.authorId || '') === String(user._id || user.id || ''));

          return (
            <div 
              key={post._id || post.id} 
              className="feed-post"
              style={{
                background: 'white',
                padding: '25px',
                borderRadius: '16px',
                marginBottom: '25px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                transition: 'all 0.4s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#1b5e20' }}>{post.user}</strong>
                  <div><small style={{ color: '#666' }}>{post.date}</small></div>
                </div>
                {isOwnPost && (
                  <button
                    onClick={() => deletePost(post._id || post.id)}
                    style={{
                      padding: '8px 12px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Delete my post
                  </button>
                )}
              </div>
            
            <p style={{ fontSize: '17px', lineHeight: '1.6', color: '#333', marginBottom: '20px' }}>
              {post.content}
            </p>

              <button 
                onClick={() => likePost(post._id || post.id)}
                style={{
                  padding: '10px 20px',
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#c8e6c9'}
                onMouseOut={(e) => e.target.style.background = '#f0f0f0'}
              >
                ❤️ {post.likes}
              </button>
            </div>
          );
        })}
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Feed;