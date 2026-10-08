export default function ProgressBar({ cleared, total }) {
  const percentage = total ? Math.round((cleared / total) * 100) : 0
  return <div className="progress-section">
    <p><strong>{cleared} of {total} offices cleared</strong></p>
    <div className="progress-track" role="progressbar" aria-label="Clearance progress" aria-valuemin="0" aria-valuemax={total} aria-valuenow={cleared}>
      <div className="progress-value" style={{ width: `${percentage}%` }} />
    </div>
  </div>
}
