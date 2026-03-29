import './hooks.css';
import React, { useState, useEffect } from 'react';
import { submitFormData, getFormData, predictCreditScore } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Form = ({ onScoreUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [annualIncome, setAnnualIncome] = useState('');
  const [dob, setDob] = useState('');
  const [occupation, setOccupation] = useState('');

  // Credit score API fields
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [loanRepayment, setLoanRepayment] = useState('');
  const [rent, setRent] = useState('');
  const [utilities, setUtilities] = useState('');
  const [insurance, setInsurance] = useState('');
  const [desiredSavings, setDesiredSavings] = useState('');

  const [spendings, setSpendings] = useState({
    groceries: '',
    transport: '',
    entertainment: '',
    eatOut: '',
    healthcare: '',
    education: '',
    miscellaneous: '',
  });

  const [saving, setSaving] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveError, setSaveError] = useState('');
  const [activeSection, setActiveSection] = useState('profile');

  const handleSpendingChange = (name, value) => {
    setSpendings((prev) => ({ ...prev, [name]: value }));
  };

  // Load existing data on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    getFormData()
      .then((res) => {
        const d = res.data;
        if (d) {
          setAnnualIncome(d.annualIncome || '');
          setDob(d.dob ? d.dob.split('T')[0] : '');
          setOccupation(d.occupation || '');
          setMonthlyIncome(d.monthlyIncome?.toString() || '');
          setLoanRepayment(d.loanRepayment?.toString() || '');
          setRent(d.rent?.toString() || '');
          setUtilities(d.utilities?.toString() || '');
          setInsurance(d.insurance?.toString() || '');
          setDesiredSavings(d.desiredSavings?.toString() || '');
          if (d.spendings) {
            setSpendings({
              groceries: d.spendings.groceries?.toString() || '',
              transport: d.spendings.transport?.toString() || '',
              entertainment: d.spendings.entertainment?.toString() || '',
              eatOut: d.spendings.eatOut?.toString() || '',
              healthcare: d.spendings.healthcare?.toString() || '',
              education: d.spendings.education?.toString() || '',
              miscellaneous: d.spendings.miscellaneous?.toString() || '',
            });
          }
          // If there's a saved credit score, push it to parent
          if (d.creditScoreResult?.credit_score && onScoreUpdate) {
            onScoreUpdate(d.creditScoreResult);
          }
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    setSaveError('');
    try {
      await submitFormData({
        annualIncome,
        dob: dob || null,
        occupation,
        spendings,
        monthlyIncome,
        loanRepayment,
        rent,
        utilities,
        insurance,
        desiredSavings,
      });
      setSaveMsg('Financial data saved successfully!');
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save data.');
    } finally {
      setSaving(false);
    }
  };

  const handlePredict = async () => {
    setPredicting(true);
    setSaveMsg('');
    setSaveError('');
    try {
      // First save, then predict
      await submitFormData({
        annualIncome,
        dob: dob || null,
        occupation,
        spendings,
        monthlyIncome,
        loanRepayment,
        rent,
        utilities,
        insurance,
        desiredSavings,
      });
      const res = await predictCreditScore();
      if (onScoreUpdate) {
        onScoreUpdate(res.data.data);
      }
      setSaveMsg('Credit score calculated! Check your results below.');
      setTimeout(() => setSaveMsg(''), 5000);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to predict credit score.');
    } finally {
      setPredicting(false);
    }
  };

  const spendingCategories = [
    { key: 'groceries', label: 'Groceries', icon: '🛒' },
    { key: 'transport', label: 'Transport', icon: '🚗' },
    { key: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { key: 'eatOut', label: 'Eating Out', icon: '🍽️' },
    { key: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { key: 'education', label: 'Education', icon: '📚' },
    { key: 'miscellaneous', label: 'Miscellaneous', icon: '📦' },
  ];

  const sections = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'income', label: 'Income & Loans', icon: '💰' },
    { id: 'expenses', label: 'Expenses', icon: '💳' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
  ];

  return (
    <div className="form-wrapper">
      {/* Section Tabs */}
      <div className="form-tabs">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`form-tab ${activeSection === s.id ? 'form-tab--active' : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            <span className="form-tab__icon">{s.icon}</span>
            <span className="form-tab__label">{s.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="form-section fade-in">
            <div className="form-section__header">
              <h3 className="form-section__title">Personal Information</h3>
              <p className="form-section__desc">Basic details about you</p>
            </div>
            <div className="form-grid form-grid--3">
              <div className="form-field">
                <label className="form-label">Annual Income</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">₹</span>
                  <input
                    className="form-input form-input--icon"
                    type="text"
                    placeholder="e.g. 8,00,000"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Date of Birth</label>
                <input
                  className="form-input"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Occupation</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Software Engineer"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Income & Loans Section */}
        {activeSection === 'income' && (
          <div className="form-section fade-in">
            <div className="form-section__header">
              <h3 className="form-section__title">Income & Financial Obligations</h3>
              <p className="form-section__desc">Monthly income and recurring commitments</p>
            </div>
            <div className="form-grid form-grid--3">
              <div className="form-field">
                <label className="form-label">
                  Monthly Income <span className="form-label--required">*</span>
                </label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">₹</span>
                  <input
                    className="form-input form-input--icon"
                    type="number"
                    placeholder="50000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    required
                    min="1"
                  />
                </div>
                <span className="form-hint">Required for credit score</span>
              </div>
              <div className="form-field">
                <label className="form-label">
                  Loan Repayment <span className="form-label--required">*</span>
                </label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">₹</span>
                  <input
                    className="form-input form-input--icon"
                    type="number"
                    placeholder="8000"
                    value={loanRepayment}
                    onChange={(e) => setLoanRepayment(e.target.value)}
                    min="0"
                  />
                </div>
                <span className="form-hint">EMI / monthly loan payments</span>
              </div>
              <div className="form-field">
                <label className="form-label">
                  Rent <span className="form-label--required">*</span>
                </label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">₹</span>
                  <input
                    className="form-input form-input--icon"
                    type="number"
                    placeholder="12000"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expenses Section */}
        {activeSection === 'expenses' && (
          <div className="form-section fade-in">
            <div className="form-section__header">
              <h3 className="form-section__title">Monthly Expenses</h3>
              <p className="form-section__desc">Your regular monthly spending categories</p>
            </div>
            <div className="form-grid form-grid--2">
              {spendingCategories.map((cat) => (
                <div key={cat.key} className="form-field">
                  <label className="form-label">
                    <span className="form-label__icon">{cat.icon}</span>
                    {cat.label}
                  </label>
                  <div className="form-input-wrap">
                    <span className="form-input-icon">₹</span>
                    <input
                      className="form-input form-input--icon"
                      type="number"
                      placeholder="0"
                      value={spendings[cat.key]}
                      onChange={(e) => handleSpendingChange(cat.key, e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              ))}
              <div className="form-field">
                <label className="form-label">
                  <span className="form-label__icon">⚡</span>
                  Utilities
                </label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">₹</span>
                  <input
                    className="form-input form-input--icon"
                    type="number"
                    placeholder="3000"
                    value={utilities}
                    onChange={(e) => setUtilities(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">
                  <span className="form-label__icon">🛡️</span>
                  Insurance
                </label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">₹</span>
                  <input
                    className="form-input form-input--icon"
                    type="number"
                    placeholder="2200"
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Section */}
        {activeSection === 'goals' && (
          <div className="form-section fade-in">
            <div className="form-section__header">
              <h3 className="form-section__title">Savings Goal</h3>
              <p className="form-section__desc">How much do you want to save monthly?</p>
            </div>
            <div className="form-grid form-grid--1">
              <div className="form-field form-field--wide">
                <label className="form-label">
                  <span className="form-label__icon">🎯</span>
                  Desired Monthly Savings
                </label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">₹</span>
                  <input
                    className="form-input form-input--icon form-input--large"
                    type="number"
                    placeholder="7000"
                    value={desiredSavings}
                    onChange={(e) => setDesiredSavings(e.target.value)}
                    min="0"
                  />
                </div>
                <span className="form-hint">This is factored into your credit assessment</span>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {saveMsg && (
          <div className="form-msg form-msg--success fade-in">
            <span className="form-msg__icon">✓</span> {saveMsg}
          </div>
        )}
        {saveError && (
          <div className="form-msg form-msg--error fade-in">
            <span className="form-msg__icon">✕</span> {saveError}
          </div>
        )}

        {/* Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="form-btn form-btn--secondary"
            disabled={saving || predicting}
          >
            {saving ? (
              <><span className="form-btn__spinner"></span> Saving...</>
            ) : (
              <><span className="form-btn__icon">💾</span> Save Data</>
            )}
          </button>
          <button
            type="button"
            className="form-btn form-btn--primary"
            disabled={saving || predicting || !monthlyIncome}
            onClick={handlePredict}
          >
            {predicting ? (
              <><span className="form-btn__spinner"></span> Analyzing...</>
            ) : (
              <><span className="form-btn__icon">⚡</span> Calculate Credit Score</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
