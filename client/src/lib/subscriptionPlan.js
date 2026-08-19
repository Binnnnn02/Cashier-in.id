// ============================================================
// KONFIGURASI LANGGANAN — GANTI SESUAI DATA BISNIS ANDA SENDIRI
// Dipakai oleh SubscriptionLocked.jsx dan RenewSubscriptionModal.jsx,
// supaya harga/rekening/nomor WA cuma perlu diubah di satu tempat.
// ============================================================

export const PLAN_PRICE = "Rp30.000"; // TODO: ganti harga langganan per bulan
export const PLAN_DURATION = "30 hari";

export const BANK_NAME = "PANIN BANK"; // TODO: ganti nama bank/e-wallet
export const BANK_ACCOUNT_NUMBER = "1234567890"; // TODO: ganti nomor rekening
export const BANK_ACCOUNT_NAME = "Bintang Very Purwanto"; // TODO: ganti nama pemilik

export const WHATSAPP_NUMBER = "62895629208339"; // TODO: ganti nomor WA (format 62xxxxxxxxxx, tanpa + atau spasi)

export const buildWhatsappLink = (email) => {

  const message = encodeURIComponent(
    `Halo, saya mau aktivasi/perpanjang langganan Cashier-in.\n\nEmail akun: ${email || "-"}\nSaya sudah transfer ${PLAN_PRICE} ke ${BANK_NAME} a.n. ${BANK_ACCOUNT_NAME}.`
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

};
