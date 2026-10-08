import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const tokenFromValue = (value) => { try { const url = new URL(value); return url.pathname.split("/").filter(Boolean).pop() || value; } catch { return value.trim(); } };

export default function QRScanner({ open, onClose, onScan, loading }) {
  const video = useRef(null), stream = useRef(null), detector = useRef(null), frame = useRef(null);
  const [cameraError, setCameraError] = useState(""); const [manualValue, setManualValue] = useState("");
  useEffect(() => {
    if (!open) return undefined;
    const stop = () => { if (frame.current) cancelAnimationFrame(frame.current); stream.current?.getTracks().forEach((track) => track.stop()); stream.current = null; };
    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia || !("BarcodeDetector" in window)) { setCameraError("Camera QR scanning is unavailable in this browser. Paste the QR code or link below."); return; }
      try { detector.current = new window.BarcodeDetector({ formats: ["qr_code"] }); stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); if (!video.current) return; video.current.srcObject = stream.current; await video.current.play(); const read = async () => { try { const codes = await detector.current.detect(video.current); if (codes[0]?.rawValue) { stop(); onScan(tokenFromValue(codes[0].rawValue)); return; } } catch { /* Continue reading camera frames. */ } frame.current = requestAnimationFrame(read); }; read(); } catch { setCameraError("Camera access was unavailable. Paste the QR code or link below."); }
    };
    start(); const escape = (event) => event.key === "Escape" && onClose(); window.addEventListener("keydown", escape);
    return () => { stop(); window.removeEventListener("keydown", escape); };
  }, [open, onClose, onScan]);
  if (!open) return null;
  const submit = (event) => { event.preventDefault(); if (manualValue.trim()) onScan(tokenFromValue(manualValue)); };
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="scan-title"><h2 id="scan-title">Scan QR Code</h2><video ref={video} className="scanner-video" muted playsInline aria-label="QR scanner camera preview" />{cameraError && <p className="field-error">{cameraError}</p>}<form onSubmit={submit}><label htmlFor="qr-code-value">QR token or verification link</label><input id="qr-code-value" autoFocus value={manualValue} onChange={(event) => setManualValue(event.target.value)} required /><div className="actions"><button className="button secondary" type="button" onClick={onClose}>Cancel</button><button className="button primary" type="submit" disabled={loading}>{loading ? <LoadingSpinner label="Checking…" /> : "Check clearance"}</button></div></form></section></div>;
}
