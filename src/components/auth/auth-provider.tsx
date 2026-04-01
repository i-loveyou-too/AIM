"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getAuthSession, loginInstructor, logoutInstructor } from "@/lib/services/auth.service";
import type { AuthUser } from "@/types/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
  login: (username: string, password: string, next?: string | null) => Promise<
    | { ok: true; nextPath: string }
    | { ok: false; error: string }
  >;
  logout: () => Promise<
    | { ok: true }
    | { ok: false; error: string }
  >;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshSession = useCallback(async () => {
    setStatus("loading");
    const session = await getAuthSession();
    if (session.authenticated) {
      setUser(session.user);
      setStatus("authenticated");
      return;
    }
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const login = useCallback(async (username: string, password: string, next?: string | null) => {
    setStatus("loading");
    const result = await loginInstructor(username, password, next);

    if (!result.ok) {
      setUser(null);
      setStatus("unauthenticated");
      return result;
    }

    setUser(result.user);
    setStatus("authenticated");
    return { ok: true as const, nextPath: result.nextPath };
  }, []);

  const logout = useCallback(async () => {
    const result = await logoutInstructor();
    setUser(null);
    setStatus("unauthenticated");
    if (!result.ok) {
      return { ok: false as const, error: result.error };
    }
    return { ok: true as const };
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === "authenticated",
      refreshSession,
      login,
      logout,
    }),
    [status, user, refreshSession, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
