import React, { useState, useEffect } from 'react';
import '../index.css';
import './layouts.css';
import logo from '/icon.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
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
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Current User" 
                  referrerPolicy="no-referrer"
                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #000000ff' }} 
                />
              ) : (
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                  {user?.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?"}
                </div>
              )}
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                Log in
              </Link>
            </li>
            <li>
              <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
