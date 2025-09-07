import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState('...');
  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const token = url.searchParams.get('token') || '';
        const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`, { credentials: 'include' });
        setStatus(res.ok ? 'OK' : 'Verification failed');
      } catch {
        setStatus('Verification failed');
      }
    })();
  }, []);
  return (
    <div style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>Verify email</h2>
      <p>{status}</p>
    </div>
  );
}


