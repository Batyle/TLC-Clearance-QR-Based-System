import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm";

// Fall back to whatever origin the app is actually served from so that
// locally-generated QR codes point back to the local dev server instead of
// a hard-coded production URL that may not share the same database.
const appUrl = () => {
  const configured = import.meta.env.VITE_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "https://tlc-clearance-qr-based-system.vercel.app";
};

// The token appears BOTH in the path and as a ?token= query so that any
// scanner / router combination can recover it.
export const buildVerifyUrl = (token, studentId) =>
    `${appUrl()}/verify/${encodeURIComponent(token)}` +
    `?token=${encodeURIComponent(token)}&studentId=${encodeURIComponent(studentId)}`;

export const generateQRDataUrl = (text, size = 300) =>
    QRCode.toDataURL(text, { width: size, errorCorrectionLevel: "M", margin: 1 });

export const hostedQRUrl = (text, size = 300) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(text)}`;

export const makeToken = () =>
    globalThis.crypto?.randomUUID
        ? crypto.randomUUID().replaceAll("-", "")
        : `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

// Accepts: a bare token, a full verify URL, or a legacy student-ID QR value.
export function tokenFromQRValue(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  try {
    const url = new URL(raw);
    const queryToken = url.searchParams.get("token");
    if (queryToken) return decodeURIComponent(queryToken).trim();

    const segments = url.pathname.split("/").filter(Boolean);
    const verifyIndex = segments.lastIndexOf("verify");
    if (verifyIndex >= 0 && segments[verifyIndex + 1]) {
      return decodeURIComponent(segments[verifyIndex + 1]).trim();
    }
    return segments.length
        ? decodeURIComponent(segments[segments.length - 1]).trim()
        : raw;
  } catch {
    // Not a URL — strip any /verify/ prefix and trailing query/hash.
    return raw.replace(/^.*\/verify\//, "").split(/[?#]/)[0].trim();
  }
}

export function studentIdFromQRValue(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  try {
    return (new URL(raw).searchParams.get("studentId") || "").trim();
  } catch {
    return "";
  }
}