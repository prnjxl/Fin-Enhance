import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser, registerUser, getMe } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On mount, check for existing token and restore session
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await getMe();
          setUser(res.data);
          setToken(storedToken);
        } catch (err) {
          // Token is invalid/expired — clear it
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await loginUser({ email, password });
      const { token: newToken, ...userData } = res.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      return userData;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (name, dob, email, password) => {
    try {
      setError(null);
      const res = await registerUser({ name, dob, email, password });
      const { token: newToken, ...userData } = res.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      return userData;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const handleOAuthToken = (oauthToken) => {
    localStorage.setItem('token', oauthToken);
    setToken(oauthToken);
    // Fetch user data
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        handleOAuthToken,
        clearError,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
