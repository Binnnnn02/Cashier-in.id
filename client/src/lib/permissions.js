// Daftar izin per role
// Gunakan canAccess(role, 'permission') untuk cek di komponen

export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  KASIR: "kasir",
};

export const ROLE_LABELS = {
  owner: "Owner",
  admin: "Admin",
  kasir: "Kasir",
};

export const ROLE_COLORS = {
  owner: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    badge: "bg-purple-600",
  },
  admin: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    badge: "bg-blue-600",
  },
  kasir: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    badge: "bg-emerald-600",
  },
};

// Daftar permission tiap role
const PERMISSION_MAP = {
  owner: [
    "dashboard",
    "products",          // tambah/edit/hapus produk
    "products:stock",    // tambah stok ringkas (subset dari products)
    "statistics",
    "history",
    "void",
    "settings",
    "staff",             // kelola staff (owner only)
  ],
  admin: [
    "dashboard",
    "products",
    "products:stock",
    "statistics",
    "history",
    "void",
    "settings",
  ],
  kasir: [
    "dashboard",
    "products:stock",    // hanya tambah stok ringkas
    "history",
    "void",
  ],
};

/**
 * Cek apakah role tertentu punya izin untuk permission tertentu.
 * @param {string} role  - "owner" | "admin" | "kasir"
 * @param {string} perm  - nama permission (lihat PERMISSION_MAP)
 * @returns {boolean}
 */
export function canAccess(role, perm) {
  if (!role) return false;
  return (PERMISSION_MAP[role] ?? []).includes(perm);
}

