import { useState } from 'react';
import { postJSON } from '../services/http';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function doSignup(e?: React.FormEvent) {
    try { e?.preventDefault(); } catch {}
    setStatus(null);
    try {
      await postJSON('/auth/signup', { email, password });
      setStatus('OK');
    } catch (err: any) {
      setStatus('Sign-up failed');
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>Sign up</h2>
      <form onSubmit={doSignup}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div>
          <button type="submit" style={{ width: '100%', padding: 10 }}>Sign up</button>
        </div>
      </form>
      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}


