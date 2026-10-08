const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
let initialized = false;

// This follows the EmailJS browser send API while avoiding a partially
// installed package copy that cannot be bundled in this workspace.
const emailjs = {
  init() {},
  async send(serviceId, templateId, templateParams, options) {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id: serviceId, template_id: templateId, user_id: options.publicKey, template_params: templateParams }),
    });
    if (!response.ok) throw new Error((await response.text()) || "EmailJS could not send the email.");
    return { status: response.status, text: await response.text() };
  },
};

export function initEmail() { if (!initialized) { emailjs.init({ publicKey: PUBLIC_KEY }); initialized = true; } }
export function sendQRCodeEmail({ toEmail, toName, studentId, course, verifyUrl, qrImageUrl, expiresAt, clearanceSummary }) {
  initEmail();
<<<<<<< HEAD
  const params = {
    to_email: toEmail, to_name: toName, reply_to: toEmail, student_id: studentId,
    course, verify_url: verifyUrl, qr_image_url: qrImageUrl,
    expires_at: new Date(expiresAt).toLocaleString(), clearance_summary: clearanceSummary,
    // These keep EmailJS's default Contact Us template useful until its HTML is replaced.
    from_name: `${toName} (${studentId})`,
    message: `Your clearance QR verification link: ${verifyUrl}\nValid until: ${new Date(expiresAt).toLocaleString()}\n${clearanceSummary}`,
  };
=======
  const params = { to_email: toEmail, to_name: toName, reply_to: toEmail, student_id: studentId, course, verify_url: verifyUrl, qr_image_url: qrImageUrl, expires_at: new Date(expiresAt).toLocaleString(), clearance_summary: clearanceSummary };
>>>>>>> 745318e781b58dce7c117af074a67a6b4c419ef4
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY });
}
