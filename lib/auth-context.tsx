'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthUser, User } from './types';
import { users, validCredentials } from './dummy-data';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  getUserData: (userId: string) => User | undefined;
  getAllManagers: () => User[];
  getAllMembers: () => User[];
  getManagersForAdmin: () => User[];
  getMembersUnderManager: (managerId: string) => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback((username: string, password: string): boolean => {
    const credential = validCredentials.find(
      (c) => c.username === username && c.password === password
    );

    if (credential) {
      const userData = users.find((u) => u.id === credential.userId);
      if (userData) {
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        });
        return true;
      }
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const getUserData = useCallback((userId: string): User | undefined => {
    return users.find((u) => u.id === userId);
  }, []);

  const getAllManagers = useCallback((): User[] => {
    return users.filter((u) => u.role === 'manager');
  }, []);

  const getAllMembers = useCallback((): User[] => {
    return users.filter((u) => u.role === 'member');
  }, []);

  const getManagersForAdmin = useCallback((): User[] => {
    return users.filter((u) => u.role === 'manager');
  }, []);

  const getMembersUnderManager = useCallback((managerId: string): User[] => {
    return users.filter((u) => u.role === 'member');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        getUserData,
        getAllManagers,
        getAllMembers,
        getManagersForAdmin,
        getMembersUnderManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
