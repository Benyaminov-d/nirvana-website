import { useState } from 'react';
import { postJSON } from '../services/http';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function doSignin(e?: React.FormEvent) {
    try {
      e?.preventDefault();
    } catch {}
    setStatus(null);
    try {
      await postJSON('/auth/signin', { email, password });
      setStatus('OK');
    } catch (err: any) {
      setStatus('Sign-in failed');
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>Sign in</h2>
      <form onSubmit={doSignin}>
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
          <button type="submit" style={{ width: '100%', padding: 10 }}>Sign in</button>
        </div>
      </form>
      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}


