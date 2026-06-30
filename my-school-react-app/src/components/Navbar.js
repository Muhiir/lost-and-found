import { Link } from 'react-router-dom';

function Navbar({ user, logout }) {
  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1b5e20, #4caf50)',
      padding: '18px 0',
      color: 'white',
      boxShadow: '0 4px 15px rgba(27, 94, 32, 0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '28px', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          🏛️ Campus Connect
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link 
            to="/" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              padding: '10px 18px',
              borderRadius: '30px',
              transition: 'all 0.3s ease',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            Home
          </Link>

          <Link 
            to="/lost-found" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              padding: '10px 18px',
              borderRadius: '30px',
              transition: 'all 0.3s ease',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            Lost & Found
          </Link>

          <Link 
            to="/feed" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              padding: '10px 18px',
              borderRadius: '30px',
              transition: 'all 0.3s ease',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            Campus Feed
          </Link>

          {user && (
            <Link 
              to="/profile" 
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                padding: '10px 18px',
                borderRadius: '30px',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseOut={(e) => e.target.style.background = 'transparent'}
            >
              Profile
            </Link>
          )}

          {/* Auth Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: '500' }}>Hi, {user.name}</span>
              <button 
                onClick={logout}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link 
                to="/login" 
                style={{
                  padding: '10px 22px',
                  color: 'white',
                  textDecoration: 'none',
                  border: '2px solid rgba(255,255,255,0.6)',
                  borderRadius: '30px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                style={{
                  padding: '10px 22px',
                  background: 'white',
                  color: '#1b5e20',
                  textDecoration: 'none',
                  borderRadius: '30px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


