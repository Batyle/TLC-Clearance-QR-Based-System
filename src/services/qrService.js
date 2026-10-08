import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm";

const DEFAULT_PUBLIC_APP_URL = "https://tlc-clearance-qr-based-system.vercel.app";
const appUrl = () => (import.meta.env.VITE_PUBLIC_APP_URL || DEFAULT_PUBLIC_APP_URL).replace(/\/$/, "");

export const buildVerifyUrl = (token, studentId) => `${appUrl()}/verify/${encodeURIComponent(token)}?studentId=${encodeURIComponent(studentId)}`;
export const generateQRDataUrl = (text, size = 300) => QRCode.toDataURL(text, { width: size, errorCorrectionLevel: "M", margin: 1 });
export const hostedQRUrl = (text, size = 300) => `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(text)}`;
export const makeToken = () => globalThis.crypto?.randomUUID ? crypto.randomUUID().replaceAll("-", "") : `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

// Accept a token, a verification URL, or the value from older student-ID QR codes.
export function tokenFromQRValue(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    const queryToken = url.searchParams.get("token");
    if (queryToken) return queryToken;
    const parts = `${url.pathname}${url.hash}`.split("/").filter(Boolean);
    const verifyIndex = parts.lastIndexOf("verify");
    return decodeURIComponent(verifyIndex >= 0 ? parts[verifyIndex + 1] || "" : parts.at(-1) || raw);
  } catch {
    return raw.replace(/^.*\/verify\//, "").split(/[?#]/)[0].trim();
  }
}

export function studentIdFromQRValue(value) {
  try {
    return new URL(String(value)).searchParams.get("studentId")?.trim() || "";
  } catch {
    return "";
  }
}
