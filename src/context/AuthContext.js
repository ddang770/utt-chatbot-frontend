import { createContext, useState, useContext, useEffect } from 'react';
import axios from '../config/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Only check auth once on mount and when token changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      // Add token to request headers
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/auth/me', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token'); // Clear invalid token
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email,
        password
      }, { withCredentials: true });

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        await checkAuth();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Add logout API call if needed
      // await axios.post('http://localhost:8000/auth/logout');
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const update_password = async (currentPassword, newPassword) => {
    try {
      return await axios.post('http://localhost:8000/admin/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
    } catch (error) {
      console.error('Update password failed:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, update_password, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);