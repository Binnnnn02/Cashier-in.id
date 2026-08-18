import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  // User yang sedang login (null = belum login)
  const [admin, setAdmin] = useState(null);

  // Masih mengecek sesi login saat pertama kali app dibuka
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {

    // Cek sesi yang sudah tersimpan (auto-login)
    supabase.auth.getSession().then(({ data }) => {

      const user = data.session?.user;

      setAdmin(
        user
          ? { id: user.id, email: user.email }
          : null
      );

      setAuthLoading(false);

    });

    // Dengarkan perubahan sesi (login, logout, token refresh, dari tab lain, dll)
    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {

        const user = session?.user;

        setAdmin(
          user
            ? { id: user.id, email: user.email }
            : null
        );

        setAuthLoading(false);

      });

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  // Login
  const login = async (email, password) => {

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {

      return {
        success: false,
        message: error.message,
      };

    }

    setAdmin({
      id: data.user.id,
      email: data.user.email,
    });

    return { success: true };

  };

  // Daftar toko baru
  const register = async (email, password, storeName) => {

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { store_name: storeName },
        },
      });

    if (error) {

      return {
        success: false,
        message: error.message,
      };

    }

    return {
      success: true,
      needsEmailConfirm: !data.session,
    };

  };

  // Logout
  const logout = async () => {

    await supabase.auth.signOut();

    setAdmin(null);

  };

  // Ganti email login
  const updateEmail = async (newEmail) => {

    const { error } =
      await supabase.auth.updateUser({
        email: newEmail,
      });

    if (error) {

      return {
        success: false,
        message: error.message,
      };

    }

    return { success: true };

  };

  // Ganti password (verifikasi password lama dulu sebelum mengganti)
  const changePassword = async (
    currentPassword,
    newPassword
  ) => {

    if (!admin?.email) {

      return {
        success: false,
        message: "Sesi tidak ditemukan, silakan login ulang",
      };

    }

    const { error: verifyError } =
      await supabase.auth.signInWithPassword({
        email: admin.email,
        password: currentPassword,
      });

    if (verifyError) {

      return {
        success: false,
        message: "Password saat ini salah",
      };

    }

    const { error: updateError } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (updateError) {

      return {
        success: false,
        message: updateError.message,
      };

    }

    return { success: true };

  };

  return (

    <AuthContext.Provider
      value={{

        admin,
        authLoading,

        login,
        register,
        logout,

        updateEmail,
        changePassword,

      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export function useAuth() {

  return useContext(AuthContext);

}