import { useEffect, useState } from 'react';
import { getJSON } from '@services/http';

export default function CryptoRiskPage() {
  const [text, setText] = useState('');
  useEffect(()=>{ getJSON<string>('/md/crypto-risk', { headers: { Accept: 'text/markdown,text/plain,*/*' } } as any).then(setText).catch(()=> setText('')); },[]);
  return (
    <div className="prose prose-invert max-w-none">
      <pre className="whitespace-pre-wrap text-[13px]">{text}</pre>
    </div>
  );
}


