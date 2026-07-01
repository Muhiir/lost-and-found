import { Link } from 'react-router-dom';

function Home({ user }) {
  return (
    <div className="page-shell home-shell" style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#eef7ef' }}>
      <div className="page-card home-card" style={{ width: '100%', maxWidth: '760px', background: 'white', borderRadius: '24px', boxShadow: '0 24px 80px rgba(15, 23, 42, 0.12)', padding: '56px 42px', color: '#124b22' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '28px', padding: '14px 20px', borderRadius: '999px', background: '#eaf5ea' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#1b5e20', display: 'grid', placeItems: 'center', color: 'white', fontWeight: '700', fontSize: '18px' }}>
            C
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700' }}>Campus Connect</div>
            <div style={{ fontSize: '13px', color: '#4a7d56' }}>Green + white campus hub</div>
          </div>
        </div>

        <h1 style={{ margin: '0 0 16px', fontSize: '42px', lineHeight: '1.05', fontWeight: '700' }}>Welcome to Campus Connect</h1>
        <p style={{ margin: '0 0 36px', fontSize: '18px', color: '#4f6f52' }}>
          A simple student portal for lost & found, campus updates, and your profile.
        </p>

        <div className="home-grid" style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <Link className="home-link" to="/lost-found" style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', padding: '16px 24px', borderRadius: '14px', backgroundColor: '#1b5e20', color: 'white', textDecoration: 'none', fontWeight: '600' }}>
            Lost & Found
          </Link>
          <Link className="home-link" to="/feed" style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', padding: '16px 24px', borderRadius: '14px', backgroundColor: '#2e7d32', color: 'white', textDecoration: 'none', fontWeight: '600' }}>
            Campus Feed
          </Link>
          <Link className="home-link" to="/profile" style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', padding: '16px 24px', borderRadius: '14px', backgroundColor: '#388e3c', color: 'white', textDecoration: 'none', fontWeight: '600' }}>
            Profile Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;