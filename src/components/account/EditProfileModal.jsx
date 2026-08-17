import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function EditProfileModal({
  open,
  account,
  onClose,
  onSave,
}) {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (open) {
      setEmail(account?.email || "");
      setLoading(false);
    }

  }, [open, account]);

  if (!open) return null;

  const handleSubmit = async (e) => {

    e.preventDefault();

    const trimmed = email.trim();

    if (!trimmed) {
      toast.error("Email tidak boleh kosong");
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (!validEmail) {
      toast.error("Format email tidak valid");
      return;
    }

    setLoading(true);

    const success = await onSave({ email: trimmed });

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
            Edit Profil
          </h2>

          <button type="button" onClick={onClose}>
            <X />
          </button>

        </div>

        <div>

          <label className="text-sm text-gray-500">
            Email Login
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />

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