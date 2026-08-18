import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function ChangePasswordModal({
  open,
  onClose,
  onSave,
}) {

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    }

  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);

    // Verifikasi & penggantian password sepenuhnya ditangani Supabase Auth
    // lewat fungsi onSave (parent), termasuk pengecekan password lama.
    const success = await onSave(currentPassword, newPassword);

    setLoading(false);

    if (success) {
      onClose();
    }

  };

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl w-[420px] p-6"
      >

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Ganti Password
          </h2>

          <button type="button" onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="space-y-4">

          <div>

            <label className="text-sm text-gray-500">
              Password Saat Ini
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />

          </div>

          <div>

            <label className="text-sm text-gray-500">
              Password Baru
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />

          </div>

          <div>

            <label className="text-sm text-gray-500">
              Konfirmasi Password Baru
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Simpan"}
          </button>

        </div>

      </form>

    </div>

  );

}