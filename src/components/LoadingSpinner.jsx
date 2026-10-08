export default function LoadingSpinner({ label = "Loading…" }) { return <span className="spinner-wrap" role="status" aria-live="polite"><span className="spinner" />{label}</span>; }
