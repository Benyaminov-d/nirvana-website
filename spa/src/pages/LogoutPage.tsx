import { useEffect, useState } from 'react';
import { postJSON } from '../services/http';

export default function LogoutPage() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    (async () => {
      try { await postJSON('/auth/logout', {}); } catch {}
      setDone(true);
    })();
  }, []);
  return (
    <div style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>Logout</h2>
      <p>{done ? 'OK' : '...'}</p>
    </div>
  );
}


