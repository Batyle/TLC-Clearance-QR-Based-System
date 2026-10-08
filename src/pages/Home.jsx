import { Link } from "react-router-dom";
import "../home.css";

const features = [
  { title: "Live clearance tracking", text: "Students can follow each office approval as it changes in real time." },
  { title: "Office request review", text: "Staff see the pending requests for their office and can approve or reject each one." },
  { title: "Secure QR verification", text: "Time-limited QR codes let staff look up a clearance quickly and record each successful scan." },
];

export default function Home() {
  return <main className="home-page"><header className="home-nav"><Link className="brand" to="/">TLC Clearance</Link><Link className="button secondary" to="/login">Sign in</Link></header><section className="home-hero"><p className="eyebrow">QR-based clearance management</p><h1>Clear student clearance without the paper chase.</h1><p>One place for students to check progress and for offices to review, verify, and update clearance requests.</p><div className="home-actions"><Link className="button primary" to="/login">Get started</Link><a className="button secondary" href="#features">Explore features</a></div></section><section id="features" className="feature-section" aria-labelledby="features-title"><div><p className="eyebrow">Built for the clearance process</p><h2 id="features-title">Everything each side needs</h2></div><div className="feature-grid">{features.map((feature) => <article className="feature-card" key={feature.title}><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></section><section className="home-flow" aria-labelledby="flow-title"><p className="eyebrow">How it works</p><h2 id="flow-title">Simple from request to verified clearance</h2><ol><li><strong>Students sign in</strong><span>They view clearance status across each office.</span></li><li><strong>Staff review requests</strong><span>Each office approves or rejects its pending requests.</span></li><li><strong>Verify by QR code</strong><span>Staff scan a student’s QR code or enter an ID for a quick lookup.</span></li></ol></section></main>;
}
