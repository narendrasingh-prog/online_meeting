"use client";
import { AuthService } from "@/services/AuthService";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { AuthProvider } from "./AuthContext";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const service = await AuthService.Client();
      const res = await service.getUsers();
      setUser(res ?? null);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <p>Loading user...</p>;
  return <AuthProvider initialUser={user}>{children}</AuthProvider>;
};

export default UserProvider;
