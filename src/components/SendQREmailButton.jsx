import { useEffect, useState } from "react";
import {
  createQRToken,
  markEmailSent,
  OFFICES,
} from "../services/clearanceService";
import { generateQRDataUrl, hostedQRUrl } from "../services/qrService";
import { sendQRCodeEmail } from "../services/emailService";
import LoadingSpinner from "./LoadingSpinner";
import Toast from "./Toast";

export default function SendQREmailButton({ student, studentId }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [msg, setMsg] = useState(null);
  const [recipient, setRecipient] = useState(student?.email || "");

  useEffect(() => setRecipient(student?.email || ""), [student?.email]);

  const handleSend = async () => {
    const toEmail = recipient.trim();
    if (!/^\S+@\S+\.\S+$/.test(toEmail))
      return setMsg({ type: "error", text: "Enter a valid recipient email address." });

    setLoading(true);
    setMsg(null);
    try {
      const { token, expiresAt, verifyUrl } = await createQRToken(studentId);
      setPreview(await generateQRDataUrl(verifyUrl, 320));

      const clearedCount = OFFICES.filter(
          (office) => student.clearanceStatus?.[office] === "approved"
      ).length;

      await sendQRCodeEmail({
        toEmail,
        toName: student.name,
        studentId,
        course: student.course,
        verifyUrl,
        qrImageUrl: hostedQRUrl(verifyUrl, 300),
        expiresAt,
        clearanceSummary: `${clearedCount} of ${OFFICES.length} offices cleared`,
      });

      await markEmailSent(studentId, token);
      setMsg({ type: "success", text: `QR code sent to ${toEmail}.` });
    } catch (error) {
      setMsg({ type: "error", text: error.message || "Unable to send the QR code." });
    } finally {
      setLoading(false);
    }
  };

  return (
      <section className="card qr-card">
        <h2>Clearance QR code</h2>
        <p>Email a time limited, single use QR code for office verification.</p>
        <div className="field">
          <label htmlFor="qr-recipient">Send to email</label>
          <input
              id="qr-recipient"
              type="email"
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder="name@example.com"
          />
        </div>
        <button
            className="button primary"
            type="button"
            onClick={handleSend}
            disabled={loading}
        >
          {loading ? <LoadingSpinner label="Sending…" /> : "📧 Email My Clearance QR Code"}
        </button>
        <Toast message={msg} />
        {preview && (
            <figure className="qr-preview">
              <img src={preview} alt="Clearance QR code preview" />
              <figcaption>Single-use · expires in 24 hours</figcaption>
            </figure>
        )}
      </section>
  );
}