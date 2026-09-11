import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";
import { canAccess } from "../lib/permissions";

const RoleContext = createContext();

export function RoleProvider({ children }) {

  const { admin } = useAuth();

  // "owner" | "admin" | "kasir" | null (belum selesai load)
  const [role, setRole] = useState(null);

  // Profil staff jika user adalah staff (bukan owner)
  const [staffProfile, setStaffProfile] = useState(null);

  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {

    let active = true;

    const detectRole = async () => {

      if (!admin?.id) {
        if (active) {
          setRole(null);
          setStaffProfile(null);
          setRoleLoading(false);
        }
        return;
      }

      setRoleLoading(true);

      // Cek apakah user ini terdaftar sebagai staff
      const { data: staffData, error } = await supabase
        .from("staff")
        .select("*")
        .eq("user_id", admin.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error("Gagal mengecek role staff:", error.message);
        // Default ke owner jika gagal query
        setRole("owner");
        setStaffProfile(null);
      } else if (staffData) {
        // User adalah staff — gunakan role dari record staff
        setRole(staffData.role); // "admin" | "kasir"
        setStaffProfile(staffData);
      } else {
        // Tidak ditemukan di tabel staff → user adalah owner
        setRole("owner");
        setStaffProfile(null);
      }

      setRoleLoading(false);

    };

    detectRole();

    return () => {
      active = false;
    };

  }, [admin?.id]);

  /**
   * Cek permission berdasarkan role aktif.
   * Contoh: hasPermission("statistics") → true/false
   */
  const hasPermission = (perm) => canAccess(role, perm);

  return (

    <RoleContext.Provider
      value={{
        role,
        staffProfile,
        roleLoading,
        hasPermission,
      }}
    >

      {children}

    </RoleContext.Provider>

  );

}

export function useRole() {
  return useContext(RoleContext);
}

