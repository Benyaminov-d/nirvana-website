import { useState } from 'react';
import { postJSON } from '../services/http';

export default function RequestResetPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  async function submit(e?: React.FormEvent) {
    try { e?.preventDefault(); } catch {}
    setStatus(null);
    try {
      await postJSON('/auth/request-password-reset', { email });
      setStatus('OK');
    } catch {
      setStatus('Request failed');
    }
  }
  return (
    <div style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>Request password reset</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 12 }}>
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10 }}>Send</button>
      </form>
      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}


