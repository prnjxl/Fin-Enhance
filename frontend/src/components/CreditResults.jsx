import React from 'react';
import './components.css';

const CreditResults = ({ data }) => {
  if (!data || !data.credit_score) return null;

  const score = data.credit_score;
  const riskLevel = data.risk_level || '';
  const financialHealth = data.financial_health || '';
  const metrics = data.metrics || {};
  const recommendations = data.recommendations || [];

  // Score color and gradient
  const getScoreColor = () => {
    if (score >= 70) return { main: '#22c55e', bg: 'linear-gradient(135deg, #22c55e, #16a34a)', label: 'Excellent' };
    if (score >= 40) return { main: '#f59e0b', bg: 'linear-gradient(135deg, #f59e0b, #d97706)', label: 'Average' };
    return { main: '#ef4444', bg: 'linear-gradient(135deg, #ef4444, #dc2626)', label: 'Poor' };
  };

  const scoreStyle = getScoreColor();
  const scorePercent = Math.min(score, 100);

  // Risk badge style
  const getRiskBadgeClass = () => {
    if (riskLevel.includes('Low')) return 'risk-badge--low';
    if (riskLevel.includes('Moderate')) return 'risk-badge--moderate';
    return 'risk-badge--high';
  };

  // Format ratio as percentage
  const formatRatio = (val) => {
    if (val === undefined || val === null) return '—';
    return `${(val * 100).toFixed(1)}%`;
  };

  const metricCards = [
    {
      label: 'Debt-to-Income',
      value: formatRatio(metrics.dti),
      icon: '📊',
      desc: 'Loan repayments vs income',
      color: metrics.dti > 0.4 ? '#ef4444' : metrics.dti > 0.2 ? '#f59e0b' : '#22c55e',
    },
    {
      label: 'Expense Ratio',
      value: formatRatio(metrics.expense_ratio),
      icon: '💸',
      desc: 'Total expenses vs income',
      color: metrics.expense_ratio > 0.7 ? '#ef4444' : metrics.expense_ratio > 0.5 ? '#f59e0b' : '#22c55e',
    },
    {
      label: 'Savings Ratio',
      value: formatRatio(metrics.savings_ratio),
      icon: '🏦',
      desc: 'Desired savings vs income',
      color: metrics.savings_ratio < 0.1 ? '#ef4444' : metrics.savings_ratio < 0.2 ? '#f59e0b' : '#22c55e',
    },
    {
      label: 'Disposable Ratio',
      value: formatRatio(metrics.disposable_ratio),
      icon: '💎',
      desc: 'Free income after expenses',
      color: metrics.disposable_ratio < 0.2 ? '#ef4444' : metrics.disposable_ratio < 0.4 ? '#f59e0b' : '#22c55e',
    },
  ];

  return (
    <div className="csr fade-in-up">
      {/* Hero Score Card */}
      <div className="csr-hero">
        <div className="csr-hero__score-ring">
          <svg viewBox="0 0 120 120" className="csr-hero__svg">
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke={scoreStyle.main}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${scorePercent * 3.267} 326.7`}
              transform="rotate(-90 60 60)"
              className="csr-hero__progress"
            />
          </svg>
          <div className="csr-hero__score-text">
            <span className="csr-hero__number" style={{ color: scoreStyle.main }}>
              {score.toFixed(1)}
            </span>
            <span className="csr-hero__out-of">/ 100</span>
          </div>
        </div>

        <div className="csr-hero__info">
          <div className="csr-hero__title">Credit Score</div>
          <div className={`csr-hero__risk-badge ${getRiskBadgeClass()}`}>
            {riskLevel}
          </div>
          <div className="csr-hero__health">{financialHealth}</div>
          {data.calculatedAt && (
            <div className="csr-hero__date">
              Last calculated: {new Date(data.calculatedAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="csr-metrics">
        <h3 className="csr-section-title">Financial Metrics</h3>
        <div className="csr-metrics__grid">
          {metricCards.map((m, i) => (
            <div key={i} className="csr-metric-card">
              <div className="csr-metric-card__header">
                <span className="csr-metric-card__icon">{m.icon}</span>
                <span className="csr-metric-card__label">{m.label}</span>
              </div>
              <div className="csr-metric-card__value" style={{ color: m.color }}>
                {m.value}
              </div>
              <div className="csr-metric-card__bar">
                <div
                  className="csr-metric-card__bar-fill"
                  style={{
                    width: m.value !== '—' ? m.value : '0%',
                    background: m.color,
                  }}
                ></div>
              </div>
              <div className="csr-metric-card__desc">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="csr-recommendations">
          <h3 className="csr-section-title">💡 Recommendations</h3>
          <div className="csr-recommendations__list">
            {recommendations.map((rec, i) => (
              <div key={i} className="csr-recommendation">
                <span className="csr-recommendation__bullet" style={{ background: scoreStyle.main }}></span>
                <span className="csr-recommendation__text">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditResults;
