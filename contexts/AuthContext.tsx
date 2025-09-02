import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../services/supabase';
import { Session, User, AuthError, UserAttributes, SignInWithPasswordCredentials, AuthResponse } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  login: (credentials: SignInWithPasswordCredentials) => Promise<AuthResponse>;
  signup: (credentials: SignInWithPasswordCredentials) => Promise<AuthResponse>;
  logout: () => Promise<{ error: AuthError | null }>;
  updateUserProfile: (data: UserAttributes) => Promise<{ user: User | null, error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    session,
    user,
    loading,
    login: (credentials: SignInWithPasswordCredentials) => supabase.auth.signInWithPassword(credentials),
    signup: (credentials: SignInWithPasswordCredentials) => supabase.auth.signUp(credentials),
    logout: () => supabase.auth.signOut(),
    updateUserProfile: async (data: UserAttributes) => {
        const { data: userData, error } = await supabase.auth.updateUser(data);
        return { user: userData?.user ?? null, error };
    }
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
