export default function StatusBadge({ status = "pending" }) { return <span className={`badge ${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>; }
