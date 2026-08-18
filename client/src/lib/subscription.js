// Hitung status akses berdasarkan subscription_status & subscription_expires_at
// dari tabel profiles. Dipakai untuk mengunci/membuka akses aplikasi.

export function getSubscriptionAccess(store) {

  if (!store) {

    return {
      allowed: false,
      reason: "unknown",
      daysLeft: 0,
    };

  }

  const status = store.subscriptionStatus;

  const expiresAt = store.subscriptionExpiresAt
    ? new Date(store.subscriptionExpiresAt)
    : null;

  const now = new Date();

  const stillValid =
    expiresAt && expiresAt.getTime() > now.getTime();

  const daysLeft = expiresAt
    ? Math.max(
        0,
        Math.ceil(
          (expiresAt.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  // Trial atau langganan aktif, dan belum lewat tanggal expired
  if (
    (status === "trial" || status === "active") &&
    stillValid
  ) {

    return {
      allowed: true,
      reason: status,
      daysLeft,
    };

  }

  // Trial habis, langganan habis, atau memang belum aktif
  return {
    allowed: false,
    reason:
      status === "trial"
        ? "trial_expired"
        : status === "active"
        ? "subscription_expired"
        : "inactive",
    daysLeft: 0,
  };

}