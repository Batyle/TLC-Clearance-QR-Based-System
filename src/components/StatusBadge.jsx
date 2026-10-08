const iconFor = { pending: "◷", approved: "✓", rejected: "×" };
export default function StatusBadge({ status = "pending" }) { return <span className={`badge ${status}`}><span className="badge-icon" aria-hidden="true">{iconFor[status] || "•"}</span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>; }
