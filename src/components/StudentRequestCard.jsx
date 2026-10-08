import StatusBadge from "./StatusBadge";

export default function StudentRequestCard({ studentId, student, office }) {
  const status = student.clearanceStatus?.[office] || "pending";
  return <article className="request-row"><div><h2>{student.name}</h2><p>{studentId} · {student.course || "Course unavailable"}</p></div><StatusBadge status={status} /><div className="actions" aria-label={`Actions for ${student.name}`}><button className="button approve" data-student-id={studentId} data-status="approved" type="button">Approve</button><button className="button reject" data-student-id={studentId} data-status="rejected" type="button">Reject</button></div></article>;
}
