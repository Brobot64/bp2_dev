'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role_id: number;
  selected_package?: string;
}

interface AuthContextType {
  loggedUser: User | null;
  setLoggedUser: (user: User | null) => void;
  token: string | null;
  hasPackage: string | null;
  setHasPackage: (pkg: string | null) => void;
  setToken: (token: string | null) => void;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [hasPackage, setHasPackage] = useState<string | null>(null);


  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getuserdata`, {
            headers: { Authorization: `${token}` },
          });
          const userData = response.data;
          setLoggedUser(userData);
          if (userData.selected_package) {
            setHasPackage(userData.selected_package);
            console.log("User has a selected package:", userData.selected_package);
          } else {
            setHasPackage(userData.selected_package)
            console.log("User does not have a selected package");
          }

          await logUserAccess();

        } catch (error) {
          console.error('Failed to fetch user data', error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    const logUserAccess = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/track`, {
          headers: { Authorization: `${token}` },
        });
        console.log('User access logged successfully.');
      } catch (error) {
        console.error('Failed to log user access', error);
      }
    };


    fetchUserData();
  }, [token]);






  const handleLogout = () => {
    setLoggedUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  };

  const logout = async () => {
    try {
      if (!token) {
        throw new Error('No token available to logout');
      }

      const headers = {
        Authorization: `${token}`
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`, {}, { headers });

      handleLogout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ logout, loggedUser, setLoggedUser, token, setToken, loading, hasPackage, setHasPackage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
