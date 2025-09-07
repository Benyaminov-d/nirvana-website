import { useEffect, useMemo, useState } from 'react';
import { fetchTickerFeed, fetchTickerFeedFiveStars } from '@services/ticker';
import Masked from '../components/Masked';
import { useCompliance } from '../context/ComplianceContext';

type FeedItem = { symbol: string; as_of?: string; cvar95?: number; cvar99?: number };

export default function TickerPage() {
  const { state } = useCompliance();
  const [items95, setItems95] = useState<FeedItem[]>([]);
  const [items99, setItems99] = useState<FeedItem[]>([]);
  const [items99fs, setItems99fs] = useState<FeedItem[]>([]);

  useEffect(()=>{
    const load = async () => {
      const f = await fetchTickerFeed();
      setItems95(f.filter(x=> x.cvar95 != null));
      setItems99(f.filter(x=> x.cvar99 != null));
      try { setItems99fs(await fetchTickerFeedFiveStars()); } catch {}
    };
    load();
    const id = setInterval(load, 45000);
    return ()=> clearInterval(id);
  },[]);

  const fmt = (n?: number) => n == null ? '-' : `-${Math.abs(n*100).toFixed(2)}%`;
  const lastDate = (arr: FeedItem[]) => {
    const d = arr.map(x=> x.as_of).filter(Boolean).sort();
    return d.length ? new Date(d[d.length-1]!).toLocaleDateString('en-US', { day:'2-digit', month:'short', year:'numeric'}) : '';
  };

  const render = (arr: FeedItem[], key: 'cvar95'|'cvar99') => (
    <div className="overflow-x-auto whitespace-nowrap py-2">
      {arr.map((it)=> (
        <span key={`${it.symbol}`} className="inline-flex items-center gap-2 px-4 py-1">
          <span className="text-white font-medium">
            {state.accepted ? it.symbol : <Masked inline scramble blur>{it.symbol}</Masked>}
          </span>
          <span className="text-[#FF4A3D] font-semibold">
            {state.accepted ? fmt(it[key]) : <Masked inline scramble blur>{fmt(it[key])}</Masked>}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="glass p-3 rounded border border-white/20">
        <div className="flex items-center gap-2 mb-2 text-[12px]">
          <div>CVaR 95% (Expected loss across 1 in 20 worst years)</div>
          <div className="text-gray-400">{state.accepted ? lastDate(items95) : <Masked inline scramble blur>{lastDate(items95) || '00 Jan 0000'}</Masked>}</div>
        </div>
        {render(items95, 'cvar95')}
      </div>
      <div className="glass p-3 rounded border border-white/20">
        <div className="flex items-center gap-2 mb-2 text-[12px]">
          <div>CVaR 99% (Expected loss across 1 in 100 worst years)</div>
          <div className="text-gray-400">{state.accepted ? lastDate(items99) : <Masked inline scramble blur>{lastDate(items99) || '00 Jan 0000'}</Masked>}</div>
        </div>
        {render(items99, 'cvar99')}
      </div>
      <div className="glass p-3 rounded border border-white/20">
        <div className="flex items-center gap-2 mb-2 text-[12px]">
          <div>Expected loss: Morningstar 5-star funds (99-CVaR, annualised)</div>
          <div className="text-gray-400">{state.accepted ? lastDate(items99fs) : <Masked inline scramble blur>{lastDate(items99fs) || '00 Jan 0000'}</Masked>}</div>
        </div>
        {render(items99fs, 'cvar99')}
      </div>
    </div>
  );
}


