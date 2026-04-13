"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Password validation: must include lowercase, uppercase, number, and special character
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must include a lowercase letter" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must include an uppercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must include a number" };
  }
  if (!/[@_#!$%^&*()+=\-[\]{}|\\:";'<>?,./]/.test(password)) {
    return { valid: false, error: "Password must include a special character (@, _, #, etc.)" };
  }
  return { valid: true };
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("marverse_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("marverse_user");
      }
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!validateEmail(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem("marverse_users") || "{}");
    if (existingUsers[email]) {
      return { success: false, error: "An account with this email already exists" };
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      createdAt: new Date().toISOString(),
    };

    // Store user credentials (in production, use proper hashing)
    existingUsers[email] = { ...newUser, password };
    localStorage.setItem("marverse_users", JSON.stringify(existingUsers));

    // Set current user
    setUser(newUser);
    localStorage.setItem("marverse_user", JSON.stringify(newUser));

    return { success: true };
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!validateEmail(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    const existingUsers = JSON.parse(localStorage.getItem("marverse_users") || "{}");
    const storedUser = existingUsers[email];

    if (!storedUser) {
      return { success: false, error: "No account found with this email" };
    }

    if (storedUser.password !== password) {
      return { success: false, error: "Incorrect password" };
    }

    const { password: _, ...userWithoutPassword } = storedUser;
    setUser(userWithoutPassword);
    localStorage.setItem("marverse_user", JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("marverse_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
