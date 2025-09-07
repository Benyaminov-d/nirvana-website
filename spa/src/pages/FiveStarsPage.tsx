import { useEffect, useState } from 'react';
import { fetchTickerFeedFiveStars } from '@services/ticker';
import Masked from '../components/Masked';
import { useCompliance } from '../context/ComplianceContext';

export default function FiveStarsPage() {
  const { state } = useCompliance();
  const [items, setItems] = useState<Array<{symbol:string; cvar99?:number}>>([]);
  useEffect(()=>{ fetchTickerFeedFiveStars().then(setItems).catch(()=> setItems([])); },[]);
  const fmt = (v?: number) => v==null? '-' : `-${Math.abs(v*100).toFixed(2)}%`;
  return (
    <div className="glass p-4 rounded border border-white/20">
      <h2 className="text-lg font-semibold mb-3">Morningstar Gold Medalist + 5-Star Rated US Mutual Funds</h2>
      <div className="flex flex-wrap gap-4">
        {items.map(x=> (
          <div key={x.symbol} className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 rounded">
            <span>{state.accepted ? x.symbol : <Masked inline scramble blur>{x.symbol}</Masked>}</span>
            <span className="text-[#FF4A3D] font-semibold">{state.accepted ? fmt(x.cvar99) : <Masked inline scramble blur>{fmt(x.cvar99)}</Masked>}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


