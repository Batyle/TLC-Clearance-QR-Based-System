import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm";

export const buildVerifyUrl = (token) => `${window.location.origin}/verify/${token}`;
export const generateQRDataUrl = (text, size = 300) => QRCode.toDataURL(text, { width: size, errorCorrectionLevel: "M", margin: 1 });
export const hostedQRUrl = (text, size = 300) => `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(text)}`;
export const makeToken = () => globalThis.crypto?.randomUUID ? crypto.randomUUID().replaceAll("-", "") : `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
