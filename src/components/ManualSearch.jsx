import { useCallback, useEffect, useRef, useState } from "react";
import useDebounce from "../hooks/useDebounce";

const validateStudentId = (value) => !value ? "Student ID is required." : /^[A-Za-z0-9-]+$/.test(value) ? "" : "Use letters, numbers, and hyphens only.";

export default function ManualSearch({ onSearch, result, loading, error }) {
  const [studentId, setStudentId] = useState("");
  const [validation, setValidation] = useState("");
  const debouncedId = useDebounce(studentId, 300);
  const lastSearch = useRef("");
  const search = useCallback((value) => { if (lastSearch.current === value) return; lastSearch.current = value; onSearch(value); }, [onSearch]);

  useEffect(() => {
    const value = debouncedId.trim();
    if (value && !validateStudentId(value)) search(value);
  }, [debouncedId, search]);

  const submit = (event) => {
    event.preventDefault();
    const value = studentId.trim();
    const errorMessage = validateStudentId(value);
    setValidation(errorMessage);
    if (!errorMessage) search(value);
  };
  const change = (event) => {
    const value = event.target.value;
    setStudentId(value);
    setValidation(value ? validateStudentId(value) : "");
    if (lastSearch.current && value.trim() !== lastSearch.current) lastSearch.current = "";
  };

  return <section className="card"><h2>Manual student search</h2><p>Enter a student ID to view clearance details.</p><form onSubmit={submit} noValidate><label htmlFor="student-search">Student ID</label><div className="search-controls"><input id="student-search" value={studentId} onChange={change} aria-invalid={Boolean(validation)} aria-describedby={validation ? "student-search-error" : undefined} placeholder="e.g. 2021-00123" /><button className="button secondary" type="submit" disabled={loading}>Search</button></div>{validation && <small id="student-search-error" className="field-error">{validation}</small>}</form>{loading && <p className="search-status" aria-live="polite">Searching…</p>}{error && <p className="field-error" role="alert">{error}</p>}{result && <div className="match"><strong>{result.name}</strong><p>{result.studentId} · {result.course}</p><p>Current clearance: <strong>{result.clearanceStatus?.[result.office] || "pending"}</strong></p></div>}</section>;
}
