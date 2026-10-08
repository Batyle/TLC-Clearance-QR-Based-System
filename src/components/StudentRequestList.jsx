import StudentRequestCard from "./StudentRequestCard";

export default function StudentRequestList({ students, office, onAction }) {
  const pendingRequests = Object.entries(students).filter(([, student]) => (student.clearanceStatus?.[office] || "pending") === "pending");
  const handleClick = (event) => { const button = event.target.closest("button[data-student-id]"); if (button) onAction({ studentId: button.dataset.studentId, status: button.dataset.status, student: students[button.dataset.studentId] }); };
  if (!pendingRequests.length) return <p className="empty-state">No pending requests for the {office} office.</p>;
  return <div className="request-list" onClick={handleClick}>{pendingRequests.map(([studentId, student]) => <StudentRequestCard key={studentId} studentId={studentId} student={student} office={office} />)}</div>;
}
