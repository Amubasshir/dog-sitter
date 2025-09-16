import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userType: "client" | "sitter" | null;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<"client" | "sitter" | null>(null);

  const loadProfile = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) {
      setUser(null);
      setUserType(null);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "id, name, email, phone, user_type, neighborhood, created_at, profile_image"
      )
      .eq("id", authUser.id)
      .single();

    if (profile) {
      const mapped: User = {
        id: profile.id,
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        profileImage: profile.profile_image || undefined,
        userType: profile.user_type,
        neighborhood: profile.neighborhood || "",
        createdAt: new Date(profile.created_at),
      };
      setUser(mapped);
      setUserType(profile.user_type);
    }
  };

  useEffect(() => {
    // initial load
    loadProfile();

    // subscribe to auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const loginWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log({data})
    if (error) throw error;
    await loadProfile();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserType(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    userType,
    loginWithPassword,
    logout,
  };
};

export { AuthContext };
