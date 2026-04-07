import React from 'react';
import { 
  ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, 
  RadarChart, PolarGrid, PolarAngleAxis as RadarAngleAxis, Radar, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell
} from 'recharts';
import './components.css';

const CreditResults = ({ data }) => {
  if (!data || !data.credit_score) return null;

  const score = data.credit_score;
  const riskLevel = data.risk_level || '';
  const financialHealth = data.financial_health || '';
  const metrics = data.metrics || {};
  const recommendations = data.recommendations || [];

  const getScoreColor = () => {
    if (score >= 70) return '#22c55e'; // Green
    if (score >= 40) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getRiskBadgeClass = () => {
    if (riskLevel.includes('Low')) return 'risk-badge--low';
    if (riskLevel.includes('Moderate')) return 'risk-badge--moderate';
    return 'risk-badge--high';
  };

  const scoreColor = getScoreColor();

  // 1. Gauge Data for Credit Score
  const gaugeData = [{ name: 'Score', value: score, fill: scoreColor }];

  // 2. Radar Data: Measuring "Health" of each ratio (Higher is better here)
  const radarData = [
    { subject: 'Income', val: (1 - Math.min(metrics.dti || 0, 1)) * 100, fullMark: 100 },
    { subject: 'Expen', val: (1 - Math.min(metrics.expense_ratio || 0, 1)) * 100, fullMark: 100 },
    { subject: 'Savings', val: Math.min(metrics.savings_ratio || 0, 1) * 100, fullMark: 100 },
    { subject: 'Disp', val: Math.min(metrics.disposable_ratio || 0, 1) * 100, fullMark: 100 },
  ];

  // 3. Bar Data: Raw percentages of metrics
  const barData = [
    { name: 'DTI', value: (metrics.dti || 0) * 100, fill: (metrics.dti || 0) > 0.4 ? '#ef4444' : '#22c55e' },
    { name: 'Expenses', value: (metrics.expense_ratio || 0) * 100, fill: (metrics.expense_ratio || 0) > 0.7 ? '#ef4444' : '#f59e0b' },
    { name: 'Savings', value: (metrics.savings_ratio || 0) * 100, fill: (metrics.savings_ratio || 0) < 0.1 ? '#ef4444' : '#3b82f6' },
    { name: 'Free Cash', value: (metrics.disposable_ratio || 0) * 100, fill: (metrics.disposable_ratio || 0) < 0.2 ? '#ef4444' : '#8b5cf6' },
  ];

  // 4. Mock Trend Data: Historical Journey
  const mockTrendData = [
    { month: 'Dec', score: Math.max(score - 14.9, 0) },
    { month: 'Jan', score: Math.max(score - 11.7, 0) },
    { month: 'Feb', score: Math.max(score - 8.5, 0) },
    { month: 'March', score: Math.max(score - 5, 0) },
    { month: 'April', score: score },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bento-tooltip">
          <p className="bento-tooltip-label">{label}</p>
          <p className="bento-tooltip-val" style={{color: payload[0].color || payload[0].fill}}>
            {payload[0].name}: {Number(payload[0].value).toFixed(1)}{payload[0].name !== 'Score' ? '%' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bento-grid fade-in-up">
      
      {/* Score Gauge Card */}
      <div className="bento-item col-span-1 row-span-2 bento-score-card" >
        <h3 className="bento-title">Financial Score</h3>
        <div className="bento-gauge-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" cy="60%" 
              innerRadius="80%" outerRadius="100%" 
              barSize={20} 
              data={gaugeData} 
              startAngle={200} endAngle={-20}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar 
                minAngle={15} 
                background={{ fill: '#f3f4f6' }} 
                clockWise={true} 
                dataKey="value" 
                cornerRadius={5} 
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="bento-gauge-text">
            <div className="bento-score-val" style={{ color: scoreColor }}>{score.toFixed(1)}</div>
          </div>
        </div>
      </div>

      

      {/* Radar Profile Chart */}
      <div className="bento-item col-span-1 row-span-3">
        <h3 className="bento-title">Balance Profile</h3>
        <p className="bento-subtitle">Areas of Expenditure</p>
        <div className="bento-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <RadarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }} />
              <Radar name="Percent" dataKey="val" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics Breakdown Bar Chart */}
      <div className="bento-item col-span-2 row-span-2">
        <h3 className="bento-title">Breakdown</h3>
        <p className="bento-subtitle"></p>
        <div className="bento-chart-container" style={{ height: '140px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
              <YAxis tickLine={false} axisLine={false} tick={{fill: '#9ca3af', fontSize: 11}} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#f9fafb'}} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bento-item flex-center row-span-1">
        <h3 className="bento-title text-center">Overall Portfolio</h3>
        <div className='bento-subtitle'>
          {data.financial_health.split(" ")[0]}
        </div>
      </div>

      {/* Risk Level & Insights (Span 1x1) */}
      <div className="bento-item flex-center row-span-1">
        <h3 className="bento-title text-center">Risk Assessment</h3>
        <div className='bento-subtitle'>
          {riskLevel || "Low"}
        </div>
      </div>

      <div className="bento-item flex-center row-span-1">
        <h3 className="bento-title text-center">Loan Approvability</h3>
        <div className='bento-subtitle'>
          {data.financial_health.split(" ")[0]} Possibility
        </div>
      </div>

      {/* Score Trajectory */}
      <div className="bento-item col-span-2 row-span-2">
        <h3 className="bento-title">Trajectory</h3>
        <p className='bento-subtitle'>Month-wise Analysis</p>
        <div className="bento-chart-container" style={{ height: '120px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrendData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={scoreColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={scoreColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" hide />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="score" stroke={scoreColor} strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations (Span 4) */}
      {recommendations.length > 0 && (
        <div className="bento-item col-span-2 row-span-1 bento-recommendations">
          <h3 className="bento-title">Insights & Discovery</h3>
          <p className="bento-subtitle">Based on Metric Ratios and Current Market Trend</p>
          <div className="bento-rec-grid">
            {recommendations.map((rec, i) => (
              <div key={i} className="bento-rec-card">
                <div className="bento-rec-icon">💡</div>
                <div className="bento-rec-text">{rec}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default CreditResults;