import { ref, get, set, update, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
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
export async function resolveToken(token) {
  const tokenRef = ref(db, `qrTokens/${token}`); const tokenSnap = await get(tokenRef); const record = tokenSnap.val();
  if (!record) return { ok: false, reason: "not_found" };
  const now = Date.now();
  if (now > record.expiresAt) return { ok: false, reason: "expired" };
  if (record.used && now - (record.usedAt || 0) > 2 * 60 * 1000) return { ok: false, reason: "used" };
  const studentSnap = await get(ref(db, `students/${record.studentId}`)); const student = studentSnap.val();
  if (!student) return { ok: false, reason: "student_missing" };
  if (!record.used) await Promise.all([update(tokenRef, { used: true, usedAt: now }), update(ref(db, `students/${record.studentId}/qr`), { used: true })]);
  return { ok: true, token, student, studentId: record.studentId };
}
export async function findStudentByEmail(email) {
  const snap = await get(ref(db, "students")); const target = email.trim().toLowerCase();
  const item = Object.entries(snap.val() || {}).find(([, student]) => student.email?.toLowerCase() === target);
  return item ? { studentId: item[0], ...item[1] } : null;
}
export async function setOfficeStatus(studentId, office, status, staffOffice) {
  if (!OFFICES.includes(office)) throw new Error("Invalid office");
  await update(ref(db, `students/${studentId}/clearanceStatus`), { [office]: status });
  await update(ref(db, `students/${studentId}`), { lastUpdated: serverTimestamp(), lastUpdatedBy: staffOffice });
}
export const watchStudent = (studentId, cb) => onValue(ref(db, `students/${studentId}`), (snap) => cb(snap.val()));
export const watchStudents = (cb, onError) => onValue(ref(db, "students"), (snap) => cb(snap.val() || {}), onError);
export const getStudents = async () => (await get(ref(db, "students"))).val() || {};
export const getStudent = async (id) => (await get(ref(db, `students/${id}`))).val();
export const getStaff = async () => (await get(ref(db, "staff"))).val() || {};
