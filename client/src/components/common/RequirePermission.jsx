import { Navigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";

/**
 * Guard component — bungkus halaman yang butuh permission tertentu.
 *
 * Penggunaan:
 *   <RequirePermission permission="statistics">
 *     <Statistics />
 *   </RequirePermission>
 *
 * Jika role tidak punya izin → redirect ke "/" (Dashboard).
 *
 * @param {string}      permission  - nama permission (lihat lib/permissions.js)
 * @param {ReactNode}   children    - komponen yang dilindungi
 * @param {string}      [redirectTo="/"] - tujuan redirect jika ditolak
 */
export default function RequirePermission({
  permission,
  children,
  redirectTo = "/",
}) {

  const { hasPermission, roleLoading } = useRole();

  // Tunggu sampai role selesai di-load
  if (roleLoading) return null;

  if (!hasPermission(permission)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;

}

