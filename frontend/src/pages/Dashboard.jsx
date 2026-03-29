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

  const handleLogout = () => {
    logout();
    navigate("/login");
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

  return (
    <div className="dash-page">
      <div className="dash-container">
        {/* Header */}
        <div className="dash-header">
          <div className="dash-header__left">
            <h1 className="dash-header__title">
              Welcome back, {user?.name?.split(' ')[0] || "User"} 👋
            </h1>
            <p className="dash-header__subtitle">
              Manage your financial profile and track your credit health
            </p>
          </div>
          <div className="dash-header__right">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="dash-avatar-img" />
            ) : (
              <div className="dash-avatar">{getInitials(user?.name)}</div>
            )}
            <div className="dash-user-info">
              <div className="dash-user-name">{user?.name}</div>
              <div className="dash-user-email">{user?.email || user?.provider}</div>
            </div>
            <button className="dash-logout-btn" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </button>
          </div>
        </div>

        {/* Quick Stats - show if we have a score */}
        {scoreData && (
          <div className="dash-quick-stats fade-in">
            <div className="dash-stat-card dash-stat-card--score">
              <div className="dash-stat-card__icon">📈</div>
              <div className="dash-stat-card__content">
                <div className="dash-stat-card__label">Credit Score</div>
                <div className="dash-stat-card__value" style={{
                  color: scoreData.credit_score >= 70 ? '#22c55e' :
                    scoreData.credit_score >= 40 ? '#f59e0b' : '#ef4444'
                }}>
                  {scoreData.credit_score?.toFixed(1)}
                </div>
              </div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-card__icon">🛡️</div>
              <div className="dash-stat-card__content">
                <div className="dash-stat-card__label">Risk Level</div>
                <div className="dash-stat-card__value dash-stat-card__value--sm">
                  {scoreData.risk_level}
                </div>
              </div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-card__icon">💚</div>
              <div className="dash-stat-card__content">
                <div className="dash-stat-card__label">Health</div>
                <div className="dash-stat-card__value dash-stat-card__value--sm">
                  {scoreData.financial_health}
                </div>
              </div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-card__icon">📊</div>
              <div className="dash-stat-card__content">
                <div className="dash-stat-card__label">DTI Ratio</div>
                <div className="dash-stat-card__value">
                  {scoreData.metrics?.dti ? `${(scoreData.metrics.dti * 100).toFixed(1)}%` : '—'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="dash-view-tabs">
          <button
            className={`dash-view-tab ${activeView === 'form' ? 'dash-view-tab--active' : ''}`}
            onClick={() => setActiveView('form')}
          >
            <span className="dash-view-tab__icon">📝</span>
            Financial Profile
          </button>
          <button
            className={`dash-view-tab ${activeView === 'results' ? 'dash-view-tab--active' : ''}`}
            onClick={() => setActiveView('results')}
            disabled={!scoreData}
          >
            <span className="dash-view-tab__icon">🏆</span>
            Credit Score Results
            {scoreData && <span className="dash-view-tab__badge">✓</span>}
          </button>
        </div>

        {/* Content Area */}
        <div className="dash-content">
          {activeView === 'form' && (
            <div className="dash-card fade-in">
              <div className="dash-card__header">
                <div>
                  <h2 className="dash-card__title">Financial Profile</h2>
                  <p className="dash-card__desc">
                    Fill in your details across all tabs, then click <strong>Calculate Credit Score</strong> to get your assessment
                  </p>
                </div>
                <div className="dash-card__badge">
                  <span className="dash-card__badge-dot"></span>
                  AI-Powered Analysis
                </div>
              </div>
              <Form onScoreUpdate={handleScoreUpdate} />
            </div>
          )}

          {activeView === 'results' && scoreData && (
            <div className="dash-card fade-in">
              <div className="dash-card__header">
                <div>
                  <h2 className="dash-card__title">Credit Score Analysis</h2>
                  <p className="dash-card__desc">
                    AI-generated assessment based on your financial profile
                  </p>
                </div>
                <button
                  className="dash-recalc-btn"
                  onClick={() => setActiveView('form')}
                >
                  <span>📝</span> Update Profile
                </button>
              </div>
              <CreditScoreResults data={scoreData} />
            </div>
          )}

          {activeView === 'results' && !scoreData && (
            <div className="dash-card dash-empty fade-in">
              <div className="dash-empty__icon">📊</div>
              <h3 className="dash-empty__title">No Credit Score Yet</h3>
              <p className="dash-empty__desc">
                Fill in your financial profile and click "Calculate Credit Score" to get your AI-powered assessment.
              </p>
              <button
                className="dash-empty__btn"
                onClick={() => setActiveView('form')}
              >
                Go to Financial Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}