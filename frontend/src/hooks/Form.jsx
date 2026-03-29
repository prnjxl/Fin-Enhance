import './hooks.css';
import React, { useState, useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { submitFormData, getFormData } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BRAND_GREEN = "#22c55e";
const BRAND_GREEN_DARK = "#16a34a";

const styles = {
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
    marginBottom: "24px",
  },
  fieldGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "12px",
    fontWeight: "600",
    color: "#444",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #e0e0e0",
    borderRadius: "8px",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "14px",
    color: "#111",
    background: "#fafafa",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  sectionTitle: {
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    margin: "28px 0 16px 0",
    paddingBottom: "8px",
    borderBottom: "1px solid #f0f0f0",
  },
  spendingGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "24px",
  },
  submitBtn: {
    padding: "13px 32px",
    background: BRAND_GREEN,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  submitBtnDisabled: {
    padding: "13px 32px",
    background: "#a0d8b0",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "not-allowed",
  },
  successMsg: {
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "13px",
    color: BRAND_GREEN_DARK,
    fontWeight: "500",
    marginTop: "12px",
  },
  errorMsg: {
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "13px",
    color: "#e53e3e",
    fontWeight: "500",
    marginTop: "12px",
  },
};

const Form = () => {
  const { isAuthenticated } = useAuth();
  const [annualIncome, setAnnualIncome] = useState('');
  const [dob, setDob] = useState('');
  const [occupation, setOccupation] = useState('');
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
  const [saveMsg, setSaveMsg] = useState('');
  const [saveError, setSaveError] = useState('');

  const handleValueChange = (name) => (value) => {
    setSpendings((prev) => ({ ...prev, [name]: value || '' }));
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
        }
      })
      .catch(() => {
        // No saved data yet — that's fine
      });
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
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
      });
      setSaveMsg('✓ Financial data saved successfully!');
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const categories = [
    { key: 'groceries', label: 'Groceries' },
    { key: 'transport', label: 'Transport' },
    { key: 'entertainment', label: 'Entertainment' },
    { key: 'eatOut', label: 'Eat-Out' },
    { key: 'healthcare', label: 'Healthcare' },
    { key: 'education', label: 'Education' },
    { key: 'miscellaneous', label: 'Miscellaneous' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div style={styles.formGrid}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Annual Income</label>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. ₹8,00,000"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(e.target.value)}
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Date of Birth</label>
          <input
            style={styles.input}
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Occupation</label>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. Software Engineer"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          />
        </div>
      </div>

      <div style={styles.sectionTitle}>Monthly Spendings</div>
      <div style={styles.spendingGrid}>
        {categories.map((cat) => (
          <div key={cat.key} style={styles.fieldGroup}>
            <label htmlFor={cat.key} style={styles.label}>
              {cat.label}
            </label>
            <CurrencyInput
              id={cat.key}
              name={cat.key}
              value={spendings[cat.key]}
              onValueChange={handleValueChange(cat.key)}
              prefix="₹ "
              placeholder="0.00"
              decimalsLimit={2}
              min={0}
              intlConfig={{ locale: 'en-IN' }}
              style={styles.input}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        style={saving ? styles.submitBtnDisabled : styles.submitBtn}
        disabled={saving}
        onMouseEnter={e => { if (!saving) e.target.style.background = BRAND_GREEN_DARK; }}
        onMouseLeave={e => { if (!saving) e.target.style.background = BRAND_GREEN; }}
      >
        {saving ? 'Saving...' : 'Save Financial Data'}
      </button>

      {saveMsg && <div style={styles.successMsg}>{saveMsg}</div>}
      {saveError && <div style={styles.errorMsg}>{saveError}</div>}
    </form>
  );
};

export default Form;
