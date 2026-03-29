import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Form from '../hooks/Form.jsx';

const BRAND_GREEN = "#22c55e";
const BRAND_GREEN_DARK = "#16a34a";

const styles = {
  page: {
    minHeight: "calc(100vh - 64px)",
    background: "#f0f0eb",
    padding: "40px 20px",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 2px 24px rgba(0,0,0,0.08)",
    padding: "32px 40px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeTitle: {
    fontFamily: "'Georgia', serif",
    fontSize: "24px",
    fontWeight: "700",
    color: "#111",
    margin: "0 0 4px 0",
  },
  welcomeSub: {
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "14px",
    color: "#777",
    margin: 0,
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: BRAND_GREEN,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "16px",
    fontWeight: "600",
  },
  avatarImg: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  userName: {
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  userEmail: {
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "12px",
    color: "#999",
  },
  logoutBtn: {
    padding: "8px 20px",
    background: "#fff",
    border: "1.5px solid #e0e0e0",
    borderRadius: "8px",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "13px",
    fontWeight: "500",
    color: "#555",
    cursor: "pointer",
    transition: "background 0.12s, border-color 0.12s",
  },
  formCard: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 2px 24px rgba(0,0,0,0.08)",
    padding: "36px 40px",
  },
  formTitle: {
    fontFamily: "'Georgia', serif",
    fontSize: "20px",
    fontWeight: "700",
    color: "#111",
    margin: "0 0 6px 0",
  },
  formSub: {
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "14px",
    color: "#777",
    margin: "0 0 28px 0",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
    marginBottom: "24px",
  },
  infoCard: {
    background: "#f9fafb",
    borderRadius: "10px",
    padding: "16px",
    border: "1px solid #f0f0f0",
  },
  infoLabel: {
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#888",
    marginBottom: "4px",
  },
  infoValue: {
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "14px",
    fontWeight: "600",
    color: "#222",
  },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.welcomeTitle}>Welcome, {user?.name || "User"} 👋</h1>
            <p style={styles.welcomeSub}>Manage your financial profile and insights</p>
          </div>
          <div style={styles.userBadge}>
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" style={styles.avatarImg} />
            ) : (
              <div style={styles.avatar}>{getInitials(user?.name)}</div>
            )}
            <div>
              <div style={styles.userName}>{user?.name}</div>
              <div style={styles.userEmail}>{user?.email || user?.provider}</div>
            </div>
            <button
              style={styles.logoutBtn}
              onClick={handleLogout}
              onMouseEnter={e => { e.currentTarget.style.background = "#f7f7f7"; e.currentTarget.style.borderColor = "#ccc"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e0e0e0"; }}
            >
              Log out
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div style={{ ...styles.formCard, marginBottom: "24px" }}>
          <h2 style={styles.formTitle}>Account Details</h2>
          <p style={styles.formSub}>Your profile information</p>
          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Name</div>
              <div style={styles.infoValue}>{user?.name || "—"}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Email</div>
              <div style={styles.infoValue}>{user?.email || "—"}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Auth Provider</div>
              <div style={styles.infoValue}>
                {user?.provider
                  ? user.provider.charAt(0).toUpperCase() + user.provider.slice(1)
                  : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Form */}
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Financial Profile</h2>
          <p style={styles.formSub}>Fill in your details to get a personalized credit assessment</p>
          <Form />
        </div>
      </div>
    </div>
  );
}