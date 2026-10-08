import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { OFFICES, getStudent, watchStudent } from "../services/clearanceService";
import StatusBadge from "../components/StatusBadge";
import SendQREmailButton from "../components/SendQREmailButton";
import LoadingSpinner from "../components/LoadingSpinner";
const session = () => JSON.parse(localStorage.getItem("clearanceSession") || "null");
const label = (office) => office[0].toUpperCase() + office.slice(1);
const offlineStudent = {
  name: "Juan Dela Cruz", email: "juan@example.com", course: "BSIT",
  clearanceStatus: { library: "pending", registrar: "approved", dean: "pending", cashier: "pending" },
  qr: { token: "", createdAt: 0, expiresAt: 0, used: false, emailSent: false },
};
export default function StudentDashboard() {
  const navigate = useNavigate(), user = session(); const [student, setStudent] = useState(null); const [selected, setSelected] = useState("");
  useEffect(() => { if (!user?.studentId) return; const refresh = async () => { try { setStudent((await getStudent(user.studentId)) || offlineStudent); } catch { setStudent(offlineStudent); } }; refresh(); const unsubscribe = watchStudent(user.studentId, (updated) => setStudent(updated || offlineStudent)); const interval = setInterval(refresh, 30000); return () => { unsubscribe(); clearInterval(interval); }; }, [user?.studentId]);
  const cleared = useMemo(() => OFFICES.filter((office) => student?.clearanceStatus?.[office] === "approved").length, [student]);
  if (!user || user.role !== "student") return <Navigate to="/login" replace />;
  const download = () => { const blob = new Blob([`TLC Clearance Certificate\n\nStudent: ${student.name}\nStudent ID: ${user.studentId}\nCourse: ${student.course}\nStatus: All offices approved\n`], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `clearance-${user.studentId}.txt`; a.click(); URL.revokeObjectURL(url); };
  return <main className="dashboard"><header className="topbar"><div><span className="brand">TLC Clearance</span><p>Welcome, {user.name} · {user.studentId}</p></div><button className="button secondary" onClick={() => { localStorage.removeItem("clearanceSession"); navigate("/login"); }}>Logout</button></header>{!student ? <LoadingSpinner label="Loading your clearance…" /> : <div className="dashboard-grid"><section className="card wide"><h1>My clearance status</h1><div className="progress-track" aria-label={`${cleared} of 4 offices cleared`}><span style={{ width: `${(cleared / OFFICES.length) * 100}%` }} /></div><p>{cleared} of {OFFICES.length} offices cleared</p><div className="table-wrap"><table><thead><tr><th>Office</th><th>Status</th><th>Last updated</th></tr></thead><tbody onClick={(event) => { const row = event.target.closest("tr[data-office]"); if (row) setSelected(row.dataset.office); }}>{OFFICES.map((office) => <tr key={office} data-office={office} className={selected === office ? "selected" : ""}><td>{label(office)}</td><td><StatusBadge status={student.clearanceStatus?.[office] || "pending"} /></td><td>{student.lastUpdated ? new Date(student.lastUpdated).toLocaleString() : "—"}</td></tr>)}</tbody></table></div></section><aside className="dashboard-side"><SendQREmailButton student={student} studentId={user.studentId} /><section className="card"><h2>Certificate</h2><p>Your certificate is available after every office approves your clearance.</p><span title={cleared === OFFICES.length ? "" : "Complete all clearances first"}><button className="button primary" disabled={cleared !== OFFICES.length} onClick={download}>Download Certificate</button></span></section></aside></div>}</main>;
}
