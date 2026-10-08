import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

export default function ManualSearch({ onSearch, result, loading, error }) {
  const [studentId, setStudentId] = useState(""); const [validation, setValidation] = useState(""); const debouncedId = useDebounce(studentId, 300);
  useEffect(() => { const value = debouncedId.trim(); if (value && /^[A-Za-z0-9-]+$/.test(value)) onSearch(value); }, [debouncedId, onSearch]);
  const submit = (event) => { event.preventDefault(); const value = studentId.trim(); if (!value) return setValidation("Student ID is required."); if (!/^[A-Za-z0-9-]+$/.test(value)) return setValidation("Use letters, numbers, and hyphens only."); setValidation(""); onSearch(value); };
  return <section className="card"><h2>Manual student search</h2><p>Enter a student ID to view clearance details.</p><form onSubmit={submit} noValidate><label htmlFor="student-search">Student ID</label><div className="search-controls"><input id="student-search" value={studentId} onChange={(event) => { setStudentId(event.target.value); setValidation(""); }} aria-invalid={Boolean(validation)} placeholder="e.g. 2021-00123" /><button className="button secondary" type="submit">Search</button></div>{validation && <small className="field-error">{validation}</small>}</form>{loading && <p className="search-status">Searching…</p>}{error && <p className="field-error">{error}</p>}{result && <div className="match"><strong>{result.name}</strong><p>{result.studentId} · {result.course}</p><p>Current clearance: <strong>{result.clearanceStatus?.[result.office] || "pending"}</strong></p></div>}</section>;
}
