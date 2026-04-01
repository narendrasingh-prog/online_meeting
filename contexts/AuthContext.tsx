"use client";

import React, { createContext, useContext } from "react";

import { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
};

type AuthProviderProps = {
  children: React.ReactNode;
  initialUser: User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children, initialUser }: AuthProviderProps) => {
  return (
    <AuthContext.Provider value={{ user: initialUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
