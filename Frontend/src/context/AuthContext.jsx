
import React, { createContext, useState, useContext, useEffect } from 'react';
import { register as registerAPI, login as loginAPI, getProfile, changePassword as changePasswordAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getProfile()
        .then(res => {
          setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (name, email, password) => {
    const { data } = await registerAPI({ name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };
  
const login = async (email, password) => {
  const { data } = await loginAPI({ email, password });
  localStorage.setItem('token', data.token);
  setUser(data.user);
  return data; 
};

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const changePassword = async (oldPassword, newPassword) => {
    await changePasswordAPI({ currentPassword: oldPassword, newPassword });
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
