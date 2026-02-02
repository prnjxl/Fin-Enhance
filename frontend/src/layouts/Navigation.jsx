import '../index.css';
import './layouts.css';
import logo from '/icon.png';

export default function Navigation() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <ul className="nav-center">
        <li href="/">Home</li>
        <li href="/features">Features</li>
        <li href="/about">About Us</li>
        <li href="/insights">Insights</li>
      </ul>

      <ul className="nav-right">
        <li>Log in</li>
        <li>Sign up</li>
      </ul>
    </nav>
  );
}
