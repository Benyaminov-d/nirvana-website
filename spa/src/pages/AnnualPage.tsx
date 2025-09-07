import { useEffect, useMemo, useState } from 'react';
import { getJSON } from '@services/http';
import Masked from '../components/Masked';
import { useCompliance } from '../context/ComplianceContext';

type AnnualRow = { year:number; as_of:string; cvar99?:number; next_year:number; next_return?:number; viol99?:boolean };

export default function AnnualPage() {
  const { state } = useCompliance();
  const params = useMemo(()=> new URLSearchParams(window.location.search), []);
  const [symbol, setSymbol] = useState(params.get('symbol') || 'SP500TR');
  const [startYear, setStart] = useState(params.get('start_year') || '2007');
  const [endYear, setEnd] = useState(params.get('end_year') || '');
  const [rows, setRows] = useState<AnnualRow[]>([]);
  const [summary, setSummary] = useState('');

  const fmtPct = (v?: number) => v == null || !Number.isFinite(v) ? '-' : `${(v*100).toFixed(2)}%`;
  const fmtLoss = (v?: number) => v == null || !Number.isFinite(v) ? '-' : `-${Math.abs(v*100).toFixed(2)}%`;

  useEffect(()=>{
    const load = async () => {
      const u = new URLSearchParams();
      if (symbol) u.set('symbol', symbol);
      if (startYear) u.set('start_year', startYear);
      if (endYear) u.set('end_year', endYear);
      const data = await getJSON<any>(`/annual_violations_db?${u.toString()}`);
      setSummary(`${data.symbol} - Years: ${data.start_year}..${data.end_year} | Considered: ${data.considered} | Violations 99%: ${data.violations99}`);
      setRows(Array.isArray(data.items) ? data.items : []);
    };
    load();
  }, [symbol, startYear, endYear]);

  useEffect(()=>{
    const u = new URL(window.location.href);
    u.searchParams.set('symbol', symbol);
    u.searchParams.set('start_year', startYear);
    if (endYear) u.searchParams.set('end_year', endYear); else u.searchParams.delete('end_year');
    window.history.replaceState(null,'',u.toString());
  }, [symbol, startYear, endYear]);

  return (
    <div className="glass p-4 rounded border border-white/10">
      <h2 className="text-lg font-semibold mb-3">Annual CVaR backtest</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <label className="text-sm">Symbol
          <input className="w-full bg-[#2d2d2d] border border-gray-600 rounded px-3 py-2" value={symbol} onChange={(e)=> setSymbol(e.target.value)} />
        </label>
        <label className="text-sm">Start year
          <input className="w-full bg-[#2d2d2d] border border-gray-600 rounded px-3 py-2" value={startYear} onChange={(e)=> setStart(e.target.value)} />
        </label>
        <label className="text-sm">End year
          <input className="w-full bg-[#2d2d2d] border border-gray-600 rounded px-3 py-2" value={endYear} onChange={(e)=> setEnd(e.target.value)} />
        </label>
      </div>
      <div className="text-sm text-gray-300 mb-3">
        {state.accepted ? summary : <Masked inline scramble blur>{summary || 'Summary'}</Masked>}
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="p-2">Year</th>
              <th className="p-2">as of</th>
              <th className="p-2">CVaR 99%</th>
              <th className="p-2">Next year</th>
              <th className="p-2">Return</th>
              <th className="p-2">Viol 99</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r)=> (
              <tr key={`${r.year}-${r.as_of}`} className={r.viol99 ? 'bg-red-900/20' : ''}>
                <td className="p-2">{r.year}</td>
                <td className="p-2">{state.accepted ? r.as_of : <Masked inline scramble blur>{r.as_of}</Masked>}</td>
                <td className="p-2">{state.accepted ? fmtLoss(r.cvar99) : <Masked inline scramble blur>{fmtLoss(r.cvar99)}</Masked>}</td>
                <td className="p-2">{r.next_year}</td>
                <td className={`p-2 ${Number(r.next_return) < 0 ? 'text-red-400' : 'text-green-400'}`}>{state.accepted ? fmtPct(r.next_return) : <Masked inline scramble blur>{fmtPct(r.next_return)}</Masked>}</td>
                <td className={`p-2 ${r.viol99 ? 'text-red-300' : 'text-gray-400'}`}>{state.accepted ? (r.viol99 ? 'Yes' : 'No') : <Masked inline scramble blur>{r.viol99 ? 'Yes' : 'No'}</Masked>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


