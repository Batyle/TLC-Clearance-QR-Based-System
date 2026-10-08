<<<<<<< HEAD
import { ref, get, set, update, onValue, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
=======
import { ref, get, set, update, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
>>>>>>> 745318e781b58dce7c117af074a67a6b4c419ef4
import { db } from "../firebase";
import { buildVerifyUrl, makeToken } from "./qrService";

export const OFFICES = ["library", "registrar", "dean", "cashier"];
const TTL_MINUTES = 30;

export async function createQRToken(studentId, ttlMinutes = TTL_MINUTES) {
  const studentSnap = await get(ref(db, `students/${studentId}/qr`));
  const oldToken = studentSnap.val()?.token;
  if (oldToken) await update(ref(db, `qrTokens/${oldToken}`), { used: true, revoked: true, usedAt: Date.now() });
  const token = makeToken(); const createdAt = Date.now(); const expiresAt = createdAt + ttlMinutes * 60 * 1000;
  await set(ref(db, `qrTokens/${token}`), { studentId, createdAt, expiresAt, used: false, usedAt: null, usedByOffice: null });
  await update(ref(db, `students/${studentId}/qr`), { token, createdAt, expiresAt, used: false, emailSent: false });
  return { token, expiresAt, verifyUrl: buildVerifyUrl(token) };
}
export async function markEmailSent(studentId, token) {
  await update(ref(db, `students/${studentId}/qr`), { emailSent: true, emailSentAt: serverTimestamp() });
  await update(ref(db, `qrTokens/${token}`), { emailSent: true });
}
<<<<<<< HEAD
export async function resolveToken(token, office) {
=======
export async function resolveToken(token) {
>>>>>>> 745318e781b58dce7c117af074a67a6b4c419ef4
  const tokenRef = ref(db, `qrTokens/${token}`); const tokenSnap = await get(tokenRef); const record = tokenSnap.val();
  if (!record) return { ok: false, reason: "not_found" };
  const now = Date.now();
  if (now > record.expiresAt) return { ok: false, reason: "expired" };
<<<<<<< HEAD
  if (record.used) return { ok: false, reason: "used" };
  const studentSnap = await get(ref(db, `students/${record.studentId}`)); const student = studentSnap.val();
  if (!student) return { ok: false, reason: "student_missing" };
  const claim = await runTransaction(tokenRef, (current) => {
    if (!current || current.used || Date.now() > current.expiresAt) return;
    return { ...current, used: true, usedAt: now, usedByOffice: office || null };
  });
  if (!claim.committed) {
    const latest = claim.snapshot.val();
    return { ok: false, reason: latest?.used ? "used" : latest ? "expired" : "not_found" };
  }
  await update(ref(db, `students/${record.studentId}/qr`), { used: true, usedAt: now, usedByOffice: office || null });
=======
  if (record.used && now - (record.usedAt || 0) > 2 * 60 * 1000) return { ok: false, reason: "used" };
  const studentSnap = await get(ref(db, `students/${record.studentId}`)); const student = studentSnap.val();
  if (!student) return { ok: false, reason: "student_missing" };
  if (!record.used) await Promise.all([update(tokenRef, { used: true, usedAt: now }), update(ref(db, `students/${record.studentId}/qr`), { used: true })]);
>>>>>>> 745318e781b58dce7c117af074a67a6b4c419ef4
  return { ok: true, token, student, studentId: record.studentId };
}
export async function findStudentByEmail(email) {
  const snap = await get(ref(db, "students")); const target = email.trim().toLowerCase();
  const item = Object.entries(snap.val() || {}).find(([, student]) => student.email?.toLowerCase() === target);
  return item ? { studentId: item[0], ...item[1] } : null;
}
export async function setOfficeStatus(studentId, office, status, staffOffice) {
  if (!OFFICES.includes(office)) throw new Error("Invalid office");
<<<<<<< HEAD
  if (!["approved", "rejected"].includes(status)) throw new Error("Invalid clearance status");
  await update(ref(db), {
    [`students/${studentId}/clearanceStatus/${office}`]: status,
    [`students/${studentId}/lastUpdated`]: serverTimestamp(),
    [`students/${studentId}/lastUpdatedBy`]: staffOffice,
  });
}
export const watchStudent = (studentId, cb) => onValue(ref(db, `students/${studentId}`), (snap) => cb(snap.val()));
export const watchStudents = (cb, onError) => onValue(ref(db, "students"), (snap) => cb(snap.val() || {}), onError);
=======
  await update(ref(db, `students/${studentId}/clearanceStatus`), { [office]: status });
  await update(ref(db, `students/${studentId}`), { lastUpdated: serverTimestamp(), lastUpdatedBy: staffOffice });
}
export const watchStudent = (studentId, cb) => onValue(ref(db, `students/${studentId}`), (snap) => cb(snap.val()));
>>>>>>> 745318e781b58dce7c117af074a67a6b4c419ef4
export const getStudents = async () => (await get(ref(db, "students"))).val() || {};
export const getStudent = async (id) => (await get(ref(db, `students/${id}`))).val();
export const getStaff = async () => (await get(ref(db, "staff"))).val() || {};
