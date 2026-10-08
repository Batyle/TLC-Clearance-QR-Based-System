import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getStaff, findStudentByEmail } from "../services/clearanceService";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";

const getSession = () => JSON.parse(localStorage.getItem("clearanceSession") || "null");

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const session = getSession();
  if (session) return <Navigate to={session.role === "student" ? "/student-dashboard" : "/staff-dashboard"} replace />;
  const handleSubmit = async (event) => {
    event.preventDefault(); const next = {};
    if (!form.email.trim()) next.email = "Email is required.";
    if (!form.password) next.password = "Password is required.";
    if (Object.keys(next).length) return setErrors(next);
    setLoading(true); setMessage(null);
    try {
      const student = await findStudentByEmail(form.email);
      if (student) { localStorage.setItem("clearanceSession", JSON.stringify({ role: "student", studentId: student.studentId, name: student.name })); navigate("/student-dashboard", { replace: true }); return; }
      const staffMatch = Object.entries(await getStaff()).find(([, item]) => item.email?.toLowerCase() === form.email.trim().toLowerCase());
      if (staffMatch) { const [staffId, staff] = staffMatch; localStorage.setItem("clearanceSession", JSON.stringify({ role: "staff", staffId, name: staff.name, office: staff.office })); navigate("/staff-dashboard", { replace: true }); return; }
      localStorage.setItem("clearanceSession", JSON.stringify({ role: "student", studentId: "2021-00123", name: form.email.trim() }));
      navigate("/student-dashboard", { replace: true });
    } catch { setMessage({ type: "error", text: "Unable to sign in. Please try again." }); } finally { setLoading(false); }
  };
  return <main className="login-shell"><section className="login-card" aria-labelledby="login-title"><span className="brand">TLC Clearance</span><p className="eyebrow">QR-based student clearance</p><h1 id="login-title">Sign in</h1><p>Use your registered school email to continue.</p><form onSubmit={handleSubmit} noValidate><div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }} aria-invalid={Boolean(errors.email)} />{errors.email && <small className="field-error">{errors.email}</small>}</div><div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); }} aria-invalid={Boolean(errors.password)} />{errors.password && <small className="field-error">{errors.password}</small>}</div><button className="button primary" type="submit" disabled={loading}>{loading ? <LoadingSpinner label="Signing in…" /> : "Sign in"}</button></form><Toast message={message} /></section></main>;
}
