import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getCreditScore } from '../services/api';
import Form from '../hooks/Form.jsx';
import CreditResults from '../components/CreditResults.jsx';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scoreData, setScoreData] = useState(null);
  const [activeView, setActiveView] = useState('form');

  // Load saved credit score on mount
  useEffect(() => {
    getCreditScore()
      .then((res) => {
        setScoreData(res.data);
      })
      .catch(() => { });
  }, []);

  const handleScoreUpdate = (data) => {
    setScoreData(data);
    setActiveView('results');
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="dash-layout">
      {/* Sidebar Navigation */}
      <aside className="dash-sidebar">
        
        <nav className="dash-sidebar__nav">
          {/* Dashboard Icon - mapped to Overview / Results */}
          <button 
            className={`sidebar-icon ${activeView === 'results' ? 'active' : ''}`} 
            title="Dashboard Overview"
            onClick={() => scoreData && setActiveView('results')}
            style={{ opacity: scoreData ? 1 : 0.5, cursor: scoreData ? 'pointer' : 'not-allowed' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
          </button>
          
          {/* Form / Edit Profile Icon - mapped to Form view */}
          <button 
            className={`sidebar-icon ${activeView === 'form' ? 'active' : ''}`} 
            title="Financial Profile Form"
            onClick={() => setActiveView('form')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          
          <button className="sidebar-icon" title="Settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        
          <button className="sidebar-icon" onClick={logout} title="Logout" style={{ color: '#000000ff' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          </button>
        </nav>
        
      </aside>

      {/* Main Content Area */}
      <main className="dash-main">

        {/* Content Wrapper */}
        <div className="dash-content-area fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="dash-breadcrumbs">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
             Dashboard
          </div>
          
          <h1 className="dash-welcome">
            Welcome back, {user?.name?.split(' ')[0] || "Greyola"}
          </h1>

          {/* Render Actual Component */}
          <div className="dash-actual-content fade-in" style={{ animationDelay: '0.3s' }}>
            {activeView === 'form' && (
              <div className="dash-component-wrapper">
                <Form onScoreUpdate={handleScoreUpdate} />
              </div>
            )}
            
            {activeView === 'results' && scoreData && (
                <CreditResults data={scoreData} />
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}