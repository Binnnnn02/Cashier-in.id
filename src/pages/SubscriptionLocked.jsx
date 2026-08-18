import { Lock, Copy, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

// ============================================================
// GANTI NILAI DI BAWAH INI SESUAI DATA BISNIS ANDA SENDIRI
// ============================================================
const PLAN_PRICE = "Rp35.999"; // TODO: ganti harga langganan per bulan
const PLAN_DURATION = "30 hari";

const BANK_NAME = "BCA"; // TODO: ganti nama bank/e-wallet
const BANK_ACCOUNT_NUMBER = "1234567890"; // TODO: ganti nomor rekening
const BANK_ACCOUNT_NAME = "Nama Pemilik Rekening"; // TODO: ganti nama pemilik

const WHATSAPP_NUMBER = "62895629208339"; // TODO: ganti nomor WA (format 62xxxxxxxxxx, tanpa + atau spasi)
// ============================================================

const HEADLINES = {

  trial_expired: {
    title: "Masa Trial Anda Sudah Berakhir",
    desc: "Trial gratis 7 hari sudah habis. Aktifkan langganan untuk lanjut memakai Cashier-in.",
  },

  subscription_expired: {
    title: "Masa Aktif Anda Sudah Berakhir",
    desc: "Trial atau langganan Anda sudah habis masa berlakunya. Aktifkan/perpanjang sekarang untuk lanjut memakai Cashier-in.",
  },

  inactive: {
    title: "Langganan Belum Aktif",
    desc: "Akun Anda belum memiliki langganan aktif. Silakan aktivasi untuk mulai menggunakan Cashier-in.",
  },

};

export default function SubscriptionLocked({ reason }) {

  const { admin, logout } = useAuth();

  const headline = HEADLINES[reason] || HEADLINES.inactive;

  const copyAccountNumber = () => {

    navigator.clipboard.writeText(BANK_ACCOUNT_NUMBER);

    toast.success("Nomor rekening disalin");

  };

  const whatsappMessage = encodeURIComponent(
    `Halo, saya mau aktivasi langganan Cashier-in.\n\nEmail akun: ${admin?.email || "-"}\nSaya sudah transfer ${PLAN_PRICE} ke ${BANK_NAME} a.n. ${BANK_ACCOUNT_NAME}.`
  );

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (

    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4 py-10">

      <div className="bg-white w-[480px] max-w-full rounded-2xl shadow-xl p-8">

        <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">

          <Lock size={28} className="text-amber-600" />

        </div>

        <h1 className="text-2xl font-bold text-center">

          {headline.title}

        </h1>

        <p className="text-gray-500 text-center mt-3 leading-relaxed">

          {headline.desc}

        </p>

        <div className="bg-emerald-50 rounded-xl p-5 mt-6 text-center">

          <p className="text-sm text-gray-500">
            Biaya Langganan
          </p>

          <p className="text-3xl font-bold text-emerald-700 mt-1">
            {PLAN_PRICE}
          </p>

          <p className="text-sm text-gray-500">
            per {PLAN_DURATION}
          </p>

        </div>

        <div className="border rounded-xl p-5 mt-4">

          <p className="text-sm font-semibold text-gray-700 mb-3">
            Transfer ke:
          </p>

          <div className="flex items-center justify-between">

            <div>

              <p className="font-bold text-lg">
                {BANK_NAME} — {BANK_ACCOUNT_NUMBER}
              </p>

              <p className="text-sm text-gray-500">
                a.n. {BANK_ACCOUNT_NAME}
              </p>

            </div>

            <button
              onClick={copyAccountNumber}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              aria-label="Salin nomor rekening"
            >
              <Copy size={18} />
            </button>

          </div>

        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition text-white py-3 rounded-xl font-semibold"
        >

          <MessageCircle size={20} />

          Konfirmasi Pembayaran via WhatsApp

        </a>

        <p className="text-center text-xs text-gray-400 mt-4">

          Setelah konfirmasi, akun Anda akan diaktifkan manual dalam waktu singkat.

        </p>

        <button
          onClick={logout}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-6"
        >
          Logout
        </button>

      </div>

    </div>

  );

}
