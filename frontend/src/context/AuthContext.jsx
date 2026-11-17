import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/axiosClient';

const TOKEN_KEY = 'smartstay_token';
const USER_KEY = 'smartstay_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  const saveSession = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken('');
    setUser(null);
  };

  useEffect(() => {
    if (!token) return;
    authApi
      .me()
      .then((res) => {
        localStorage.setItem(USER_KEY, JSON.stringify(res.data));
        setUser(res.data);
      })
      .catch(() => {
        logout();
      });
  }, [token]);

  const register = async (payload) => {
    const res = await authApi.register(payload);
    saveSession(res.data.token, res.data.user);
    return res.data;
  };

  const login = async (payload) => {
    const res = await authApi.login(payload);
    saveSession(res.data.token, res.data.user);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
