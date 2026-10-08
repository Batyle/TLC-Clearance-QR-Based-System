import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getStaff, findStudentByEmail } from "../services/clearanceService";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
import "../auth.css";

const getSession = () => JSON.parse(localStorage.getItem("clearanceSession") || "null");
const sampleAccounts = [
  { role: "Student", email: "juan@example.com", password: "1234" },
  { role: "Staff · Library", email: "library@example.com", password: "1234" },
];

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const session = getSession();
  if (session) return <Navigate to={session.role === "student" ? "/student-dashboard" : "/staff-dashboard"} replace />;

  const fillAccount = (account) => { setForm({ email: account.email, password: account.password }); setErrors({}); setMessage(null); };
  const handleSubmit = async (event) => {
    event.preventDefault(); const next = {};
    if (!form.email.trim()) next.email = "Email is required.";
    if (!form.password) next.password = "Password is required.";
    if (Object.keys(next).length) return setErrors(next);
    setLoading(true); setMessage(null);
    try {
      const student = await findStudentByEmail(form.email);
      if (student?.password === form.password) { localStorage.setItem("clearanceSession", JSON.stringify({ role: "student", studentId: student.studentId, name: student.name })); navigate("/student-dashboard", { replace: true }); return; }
      const staffMatch = Object.entries(await getStaff()).find(([, item]) => item.email?.toLowerCase() === form.email.trim().toLowerCase());
      if (staffMatch?.[1].password === form.password) { const [staffId, staff] = staffMatch; localStorage.setItem("clearanceSession", JSON.stringify({ role: "staff", staffId, name: staff.name, office: staff.office })); navigate("/staff-dashboard", { replace: true }); return; }
      setMessage({ type: "error", text: "The email or password is incorrect." });
    } catch { setMessage({ type: "error", text: "Unable to sign in. Please try again." }); } finally { setLoading(false); }
  };

  return <main className="login-shell"><section className="login-card" aria-labelledby="login-title"><span className="brand">TLC Clearance</span><p className="eyebrow">QR-based student clearance</p><h1 id="login-title">Welcome back</h1><p>Sign in to review your clearance progress or manage office requests.</p><form onSubmit={handleSubmit} noValidate><div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }} aria-invalid={Boolean(errors.email)} />{errors.email && <small className="field-error">{errors.email}</small>}</div><div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); }} aria-invalid={Boolean(errors.password)} />{errors.password && <small className="field-error">{errors.password}</small>}</div><button className="button primary login-submit" type="submit" disabled={loading}>{loading ? <LoadingSpinner label="Signing in…" /> : "Sign in"}</button></form><Toast message={message} /><section className="sample-accounts" aria-label="Test accounts"><p>Test accounts</p>{sampleAccounts.map((account) => <button key={account.email} className="sample-account" type="button" onClick={() => fillAccount(account)}><span><strong>{account.role}</strong><small>{account.email}</small></span><code>{account.password}</code><span aria-hidden="true">Use</span></button>)}</section></section></main>;
}
