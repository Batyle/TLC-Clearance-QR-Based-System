export default function Toast({ message }) { return message ? <div className={`toast ${message.type}`} role="alert">{message.text}</div> : null; }
