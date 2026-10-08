import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  findStudentByEmail,
  OFFICES,
  resolveToken,
  setOfficeStatus,
  watchStudent,
} from "../services/clearanceService";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";

const names = {
  not_found: "Invalid QR Code",
  expired: "QR Code Expired",
  used: "QR Code Already Used",
  student_missing: "Student Not Found",
};
const title = (office) => office[0].toUpperCase() + office.slice(1);

export default function VerifyPage() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const [studentState, setStudentState] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [acting, setActing] = useState("");
  const resolved = useRef(""); // guard against StrictMode double-resolve

  const attach = useCallback((studentId, student) => {
    setStudentState({ studentId, student });
    return watchStudent(studentId, (updated) =>
        setStudentState({ studentId, student: updated })
    );
  }, []);

  useEffect(() => {
    if (!token) return;
    if (resolved.current === token) return; // bail on StrictMode re-run
    resolved.current = token;

    let unsubscribe;
    setLoading(true);
    resolveToken(token, undefined, searchParams.get("studentId") || "")
        .then((result) => {
          if (!result.ok) setError(names[result.reason] || "Invalid QR Code");
          else unsubscribe = attach(result.studentId, result.student);
        })
        .catch(() => setError("Unable to verify QR code"))
        .finally(() => setLoading(false));

    return () => unsubscribe?.();
  }, [token, attach, searchParams]);

  const lookup = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const found = await findStudentByEmail(email);
      if (!found) setError("Student Not Found");
      else attach(found.studentId, found);
    } catch {
      setError("Lookup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setStatus = async (office, status) => {
    const { studentId } = studentState;
    setActing(office);
    try {
      await setOfficeStatus(studentId, office, status, "verify-page");
      setMessage({ type: "success", text: `${title(office)} marked ${status}.` });
    } catch {
      setMessage({ type: "error", text: "Unable to update clearance status." });
    } finally {
      setActing("");
    }
  };

  if (loading)
    return (
        <main className="center-page">
          <LoadingSpinner label="Verifying QR code…" />
        </main>
    );

  if (error)
    return (
        <main className="center-page">
          <section className="card error-card">
            <h1>{error}</h1>
            <p>Please request a new QR code or use email lookup.</p>
          </section>
        </main>
    );

  if (!studentState)
    return (
        <main className="center-page">
          <section className="card lookup-card">
            <h1>Find student clearance</h1>
            <p>Enter the student’s registered email address.</p>
            <form onSubmit={lookup}>
              <label htmlFor="lookup-email">Student email</label>
              <input
                  id="lookup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <button className="button primary" type="submit">
                Find student
              </button>
            </form>
          </section>
        </main>
    );

  const { student, studentId } = studentState;
  const allClear = OFFICES.every(
      (office) => student.clearanceStatus?.[office] === "approved"
  );

  return (
      <main className="verify-page">
        <section className="card verified">
          <p className="eyebrow">Verified student</p>
          <h1>{student.name}</h1>
          <p>
            <strong>ID:</strong> {studentId} · <strong>Course:</strong>{" "}
            {student.course}
          </p>
          <p>{student.email}</p>
          {allClear && (
              <div className="success-banner">🎉 All offices cleared!</div>
          )}
          <Toast message={message} />
          <div
              className="office-list"
              onClick={(event) => {
                const button = event.target.closest("button[data-office]");
                if (button) setStatus(button.dataset.office, button.dataset.status);
              }}
          >
            {OFFICES.map((office) => {
              const status = student.clearanceStatus?.[office] || "pending";
              return (
                  <article key={office} className="office-row">
                    <div>
                      <h2>{title(office)}</h2>
                      <StatusBadge status={status} />
                    </div>
                    {status !== "approved" && (
                        <div className="actions">
                          <button
                              className="button approve"
                              data-office={office}
                              data-status="approved"
                              disabled={acting === office}
                          >
                            Approve
                          </button>
                          <button
                              className="button reject"
                              data-office={office}
                              data-status="rejected"
                              disabled={acting === office}
                          >
                            Reject
                          </button>
                        </div>
                    )}
                  </article>
              );
            })}
          </div>
        </section>
      </main>
  );
}