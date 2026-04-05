import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GOOGLE_AUTH_URL, GITHUB_AUTH_URL } from "../services/api";

const BRAND_GREEN = "#22c55e";
const BRAND_GREEN_DARK = "#16a34a";
const BRAND_GREEN_LIGHT = "#dcfce7";

const styles = {
  page: {
    minHeight: "calc(100vh - 64px)",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 2px 24px rgba(0,0,0,0.08)",
    padding: "44px 48px",
    width: "100%",
    maxWidth: "480px",
  },
  cardTitle: {
    fontFamily: "'Georgia', serif",
    fontSize: "26px",
    fontWeight: "700",
    color: "#111",
    margin: "0 0 6px 0",
    lineHeight: 1.2,
  },
  cardSubtitle: {
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "14px",
    color: "#777",
    margin: "0 0 32px 0",
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
  fieldGroup: {
    marginBottom: "18px",
  },
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "18px",
  },
  primaryBtn: {
    width: "100%",
    padding: "13px",
    background: BRAND_GREEN,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.15s",
    marginBottom: "20px",
  },
  primaryBtnDisabled: {
    width: "100%",
    padding: "13px",
    background: "#a0d8b0",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "not-allowed",
    marginBottom: "20px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e8e8e8",
  },
  dividerText: {
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "12px",
    color: "#aaa",
    letterSpacing: "0.04em",
  },
  oauthGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "28px",
  },
  oauthBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    padding: "10px 8px",
    border: "1.5px solid #e0e0e0",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "13px",
    fontWeight: "500",
    color: "#333",
    transition: "background 0.12s, border-color 0.12s",
    textDecoration: "none",
  },
  switchText: {
    textAlign: "center",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "13px",
    color: "#777",
    margin: 0,
  },
  errorMsg: {
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "12px",
    color: "#e53e3e",
    marginTop: "4px",
  },
  errorBanner: {
    background: "#FEE2E2",
    border: "1px solid #EF4444",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "20px",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "13px",
    color: "#DC2626",
    fontWeight: "500",
  },
  successBanner: {
    background: BRAND_GREEN_LIGHT,
    border: `1px solid ${BRAND_GREEN}`,
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "20px",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "13px",
    color: BRAND_GREEN_DARK,
    fontWeight: "500",
  },
  hint: {
    fontSize: "11px",
    color: "#aaa",
    fontFamily: "'Helvetica Neue', sans-serif",
    marginTop: "4px",
  },
  strengthBar: {
    height: "3px",
    borderRadius: "2px",
    marginTop: "6px",
    transition: "width 0.3s, background 0.3s",
  },
};

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#24292e">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "#e0e0e0" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "", color: "#e0e0e0" },
    { label: "Weak", color: "#e53e3e" },
    { label: "Fair", color: "#ed8936" },
    { label: "Good", color: "#ecc94b" },
    { label: "Strong", color: BRAND_GREEN },
  ];
  return { score, ...map[score] };
}

export default function Signup() {
  const [form, setForm] = useState({ name: "", dob: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = "Enter your full name";
    if (!form.dob) {
      e.dob = "Please select your date of birth";
    } else {
      const age = Math.floor((Date.now() - new Date(form.dob)) / (365.25 * 24 * 3600 * 1000));
      if (age < 13) e.dob = "You must be at least 13 years old";
      if (age > 120) e.dob = "Please enter a valid date of birth";
    }
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.password || form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (form.confirm !== form.password)
      e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setApiLoading(true);
    setApiError("");
    try {
      await register(form.name, form.dob, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setApiLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const strength = getPasswordStrength(form.password);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.cardTitle}>Create your account</h1>
        <p style={styles.cardSubtitle}>Join thousands pioneering the future of credit</p>

        {apiError && (
          <div style={styles.errorBanner}>✕ {apiError}</div>
        )}

        <div style={styles.row2}>
          <div>
            <label style={styles.label}>Full name</label>
            <input
              style={{ ...styles.input, borderColor: errors.name ? "#e53e3e" : "#e0e0e0" }}
              type="text"
              placeholder="Jane Smith"
              value={form.name}
              onChange={e => set("name", e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {errors.name && <div style={styles.errorMsg}>{errors.name}</div>}
          </div>
          <div>
            <label style={styles.label}>Date of birth</label>
            <input
              style={{ ...styles.input, borderColor: errors.dob ? "#e53e3e" : "#e0e0e0" }}
              type="date"
              max={maxDateStr}
              value={form.dob}
              onChange={e => set("dob", e.target.value)}
            />
            {errors.dob && <div style={styles.errorMsg}>{errors.dob}</div>}
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={{ ...styles.input, borderColor: errors.email ? "#e53e3e" : "#e0e0e0" }}
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => set("email", e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {errors.email && <div style={styles.errorMsg}>{errors.email}</div>}
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Password</label>
          <input
            style={{ ...styles.input, borderColor: errors.password ? "#e53e3e" : "#e0e0e0" }}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => set("password", e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {form.password ? (
            <div>
              <div style={{ ...styles.strengthBar, width: `${(strength.score / 4) * 100}%`, background: strength.color }} />
              <span style={{ ...styles.hint, color: strength.color }}>{strength.label}</span>
            </div>
          ) : (
            <div style={styles.hint}>8+ chars, uppercase, number &amp; symbol recommended</div>
          )}
          {errors.password && <div style={styles.errorMsg}>{errors.password}</div>}
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Confirm password</label>
          <input
            style={{
              ...styles.input,
              borderColor: errors.confirm
                ? "#e53e3e"
                : form.confirm && form.confirm === form.password
                ? BRAND_GREEN
                : "#e0e0e0",
            }}
            type="password"
            placeholder="••••••••"
            value={form.confirm}
            onChange={e => set("confirm", e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {form.confirm && form.confirm === form.password && !errors.confirm && (
            <div style={{ ...styles.hint, color: BRAND_GREEN }}>✓ Passwords match</div>
          )}
          {errors.confirm && <div style={styles.errorMsg}>{errors.confirm}</div>}
        </div>

        <button
          style={apiLoading ? styles.primaryBtnDisabled : styles.primaryBtn}
          onClick={handleSubmit}
          disabled={apiLoading}
          onMouseEnter={e => { if (!apiLoading) e.target.style.background = BRAND_GREEN_DARK; }}
          onMouseLeave={e => { if (!apiLoading) e.target.style.background = BRAND_GREEN; }}
        >
          {apiLoading ? "Creating account..." : "Create account"}
        </button>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or sign up with</span>
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.oauthGrid}>
          <a
            href={GOOGLE_AUTH_URL}
            style={styles.oauthBtn}
            onMouseEnter={e => { e.currentTarget.style.background = "#f7f7f7"; e.currentTarget.style.borderColor = "#ccc"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e0e0e0"; }}
          >
            <GoogleIcon />
            Google
          </a>
          <a
            href={GITHUB_AUTH_URL}
            style={styles.oauthBtn}
            onMouseEnter={e => { e.currentTarget.style.background = "#f7f7f7"; e.currentTarget.style.borderColor = "#ccc"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e0e0e0"; }}
          >
            <GithubIcon />
            GitHub
          </a>
        </div>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: BRAND_GREEN_DARK, fontWeight: "600", textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}