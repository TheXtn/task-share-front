"use client"

import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.getUser();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      fetchUser();
    } else {
      setLoading(false);
    }

    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

