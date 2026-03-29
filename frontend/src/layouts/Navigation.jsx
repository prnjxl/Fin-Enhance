import '../index.css';
import './layouts.css';
import logo from '/icon.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      <ul className="nav-center">
        <li><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link></li>
        <li><Link to="/features" style={{ textDecoration: 'none', color: 'inherit' }}>Features</Link></li>
        <li><Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About Us</Link></li>
        <li><Link to="/insights" style={{ textDecoration: 'none', color: 'inherit' }}>Insights</Link></li>
      </ul>

      <ul className="nav-right">
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                {user?.name || 'Dashboard'}
              </Link>
            </li>
            <li
              onClick={logout}
              style={{ cursor: 'pointer' }}
            >
              Log out
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                Log in
              </Link>
            </li>
            <li>
              <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
                Sign up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
