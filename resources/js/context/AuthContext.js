import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('company');
  const [user, setUser] = useState(null);

  const login = useCallback((role = 'company', userData = null) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUser(userData || null);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole('company');
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  }, []);

  const setAuthFromServer = useCallback((authPayload) => {
    if (authPayload?.user) {
      setIsAuthenticated(true);
      setUserRole(authPayload.user.role || 'company');
      setUser(authPayload.user);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', authPayload.user.role || 'company');
    } else {
      setIsAuthenticated(false);
      setUserRole('company');
      setUser(null);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, logout, setAuthFromServer }}>
      {children}
    </AuthContext.Provider>
  );
};

