"use client";
import { AuthService } from "@/services/AuthService";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { AuthProvider } from "./AuthContext";

type UserProviderProps = {
  children: React.ReactNode;
  initialUser?: User | null;
};

const UserProvider = ({ children, initialUser }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [loading, setLoading] = useState(initialUser === undefined);

  useEffect(() => {
    if (initialUser !== undefined) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchUser = async () => {
      const service = await AuthService.Client();
      const res = await service.getUsers();
      if (!isMounted) return;
      setUser(res ?? null);
      setLoading(false);
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [initialUser]);

  if (loading) return <p>Loading user...</p>;
  return <AuthProvider initialUser={user}>{children}</AuthProvider>;
};

export default UserProvider;
