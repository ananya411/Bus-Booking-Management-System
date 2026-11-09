import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('bbms_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('bbms_token') || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optionally verify token if needed, or finish loading check
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res?.data?.user || res?.data) {
            const currentUser = res.data.user || res.data;
            setUser(currentUser);
            localStorage.setItem('bbms_user', JSON.stringify(currentUser));
          }
        } catch (err) {
          // If token expired or invalid, clear it
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const responseData = res.data || res;
      const receivedToken = responseData.token;
      const receivedUser = responseData.user || { email, role: responseData.role || 'customer' };

      if (receivedToken) {
        localStorage.setItem('bbms_token', receivedToken);
        setToken(receivedToken);
      }
      if (receivedUser) {
        localStorage.setItem('bbms_user', JSON.stringify(receivedUser));
        setUser(receivedUser);
      }
      return { success: true, data: responseData, message: res.message };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      const responseData = res.data || res;
      if (responseData.token) {
        localStorage.setItem('bbms_token', responseData.token);
        setToken(responseData.token);
      }
      if (responseData.user) {
        localStorage.setItem('bbms_user', JSON.stringify(responseData.user));
        setUser(responseData.user);
      }
      return { success: true, data: responseData, message: res.message };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('bbms_token');
    localStorage.removeItem('bbms_user');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isOperator: user?.role === 'operator',
    isCustomer: !user?.role || user?.role === 'customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
