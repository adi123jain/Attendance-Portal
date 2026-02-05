import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    return sessionStorage.getItem('auth') === 'true';
  });

  const login = () => {
    setAuth(true);
    sessionStorage.setItem('auth', 'true');
  };

  const logout = () => {
    setAuth(false);
    sessionStorage.removeItem('auth');
  };

  useEffect(() => {
    const storedAuth = sessionStorage.getItem('auth') === 'true';
    if (storedAuth) setAuth(true);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
