import { useEffect, useState } from 'react';
import { postJSON } from '../services/http';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      setToken(url.searchParams.get('token') || '');
    } catch {}
  }, []);
  async function submit(e?: React.FormEvent) {
    try { e?.preventDefault(); } catch {}
    setStatus(null);
    try {
      await postJSON('/auth/reset-password', { token, new_password: password });
      setStatus('OK');
    } catch {
      setStatus('Reset failed');
    }
  }
  return (
    <div style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>Reset password</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 12 }}>
          <input type="password" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10 }}>Reset</button>
      </form>
      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}


