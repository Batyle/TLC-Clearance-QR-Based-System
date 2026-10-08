import { QRCodeSVG } from 'qrcode.react'

export default function QRCodeSection({ studentId, qrGenerated, onGenerate }) {
  return <section className="qr-section" aria-labelledby="qr-title">
    <div><p className="section-label">Campus access</p><h2 id="qr-title">Clearance QR code</h2></div>
    {qrGenerated ? <div className="qr-result"><QRCodeSVG value={studentId} size={174} level="M" includeMargin /><p>QR code for student ID: <strong>{studentId}</strong></p></div> : <p>Generate a QR code for your approved clearance record.</p>}
    <button className="secondary-button" type="button" onClick={onGenerate} disabled={qrGenerated}>
      {qrGenerated ? 'QR code generated' : 'Generate QR Code'}
    </button>
    <p className="qr-warning">This QR code is single-use only.</p>
  </section>
}
