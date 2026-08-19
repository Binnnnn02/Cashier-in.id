import { Copy, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import {
  PLAN_PRICE,
  PLAN_DURATION,
  BANK_NAME,
  BANK_ACCOUNT_NUMBER,
  BANK_ACCOUNT_NAME,
  buildWhatsappLink,
} from "../../lib/subscriptionPlan";

export default function RenewSubscriptionModal({ open, onClose }) {

  const { admin } = useAuth();

  if (!open) return null;

  const copyAccountNumber = () => {

    navigator.clipboard.writeText(BANK_ACCOUNT_NUMBER);

    toast.success("Nomor rekening disalin");

  };

  const whatsappLink = buildWhatsappLink(admin?.email);

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

      <div className="bg-white rounded-2xl w-[420px] max-w-full p-6 shadow-xl">

        <h2 className="text-xl font-bold text-center">
          Perpanjang Langganan
        </h2>

        <p className="text-center text-gray-500 text-sm mt-2">
          Perpanjang sekarang supaya toko Anda tidak terkunci saat masa aktif habis.
        </p>

        <div className="bg-emerald-50 rounded-xl p-5 mt-5 text-center">

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
          Setelah konfirmasi, masa aktif Anda akan diperpanjang manual dalam waktu singkat.
        </p>

        <button
          onClick={onClose}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-6"
        >
          Tutup
        </button>

      </div>

    </div>

  );

}
