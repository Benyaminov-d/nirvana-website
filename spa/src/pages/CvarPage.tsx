import { useEffect, useMemo, useState } from 'react';
import { fetchTickers } from '@services/symbols';
import { fetchCurveAll, fetchLambert } from '@services/cvar';
import Masked from '../components/Masked';
import { useCompliance } from '../context/ComplianceContext';

type AnnualCvar = { nig?: number; ghst?: number; evar?: number };
type Curve = { annual?: AnnualCvar; as_of?: string; alpha_used?: number; cached?: boolean };

function CvarMetric({ label, value }: { label: string; value?: number }) {
  const pct = value == null || !Number.isFinite(value) ? '-' : (value * 100).toFixed(2);
  return (
    <div className="p-3 rounded-lg bg-red-900/20 border border-white/10">
      <div className="text-2xl font-bold text-red-400">-{pct}%</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

export default function CvarPage() {
  const { state } = useCompliance();
  const params = useMemo(()=> new URLSearchParams(window.location.search), []);
  const [tickers, setTickers] = useState<Array<{value: string; label: string}>>([]);
  const [symbol, setSymbol] = useState('');
  const [fullCvar, setFullCvar] = useState((params.get('full_cvar')||'').toLowerCase()==='1');
  const [lambertEnabled] = useState((params.get('lambert')||'').toLowerCase()==='1');
  const [data50, setData50] = useState<Curve | null>(null);
  const [data95, setData95] = useState<Curve | null>(null);
  const [data99, setData99] = useState<Curve | null>(null);
  const [lambert, setLambert] = useState<any | null>(null);

  useEffect(()=>{
    fetchTickers().then((opts)=>{
      setTickers(opts);
      const param = (params.get('ticker') || params.get('symbol') || '').trim().toUpperCase();
      if (param && opts.find(o=> o.value.toUpperCase()===param)) setSymbol(param);
      else if (opts.length) setSymbol(opts[0].value);
    }).catch(()=>{
      const fallback = [
        { value:'SP500TR', label: 'S&P 500 Total Return (SP500TR)' },
        { value:'BTC', label:'Bitcoin (BTC)'},
        { value:'ETH', label:'Ethereum (ETH)'}
      ];
      setTickers(fallback); setSymbol('SP500TR');
    });
  },[]);

  useEffect(()=>{
    if (!symbol) return;
    const q = new URLSearchParams(window.location.search);
    q.set('ticker', symbol);
    if (fullCvar) q.set('full_cvar','1'); else q.delete('full_cvar');
    const url = `${window.location.pathname}?${q.toString()}`;
    window.history.replaceState(null,'',url);

    fetchCurveAll(symbol).then(({ cvar50, cvar95, cvar99 })=>{
      setData50(cvar50||null); setData95(cvar95||null); setData99(cvar99||null);
    });
    if (lambertEnabled) fetchLambert(symbol).then(setLambert).catch(()=> setLambert(null));
  }, [symbol, fullCvar]);

  const worst = (a?: AnnualCvar) => {
    const arr = [a?.nig, a?.ghst, a?.evar].filter((v)=> v != null && Number.isFinite(Number(v))) as number[];
    return arr.length ? Math.max(...arr) : undefined;
  };
  const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', {day:'2-digit', month:'short', year:'numeric'}) : '-';

  return (
    <div className="flex flex-col gap-4">
      <div className="glass p-4 rounded border border-white/20">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm">Asset
            <select value={symbol} onChange={(e)=> setSymbol(e.target.value)} className="w-full px-4 py-3 bg-[#2d2d2d] border border-gray-600 rounded-lg text-white">
              {tickers.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" checked={fullCvar} onChange={(e)=> setFullCvar(e.target.checked)} /> Show family (NIG/GHST/EVaR)
          </label>
        </div>
      </div>

      {lambertEnabled && lambert && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="glass p-4 rounded border border-white/20">
            <h3 className="text-lg font-semibold">Lambert Benchmarks α = 95%</h3>
            <div className="grid grid-cols-3 gap-4 text-sm mt-2">
              {lambert.nig && <div><div className="font-semibold">NIG: {(lambert.nig.ETL_5*100).toFixed(2)}%</div><div className="text-xs text-gray-500">Lambert</div></div>}
              {lambert.ghst && <div><div className="font-semibold">GHST: {(lambert.ghst.ETL_5*100).toFixed(2)}%</div><div className="text-xs text-gray-500">Lambert</div></div>}
              {lambert.evar && <div><div className="font-semibold">EVaR: {(lambert.evar.ETL_5*100).toFixed(2)}%</div><div className="text-xs text-gray-500">Lambert</div></div>}
            </div>
          </div>
          <div className="glass p-4 rounded border border-white/20">
            <h3 className="text-lg font-semibold">Lambert Benchmarks α = 99%</h3>
            <div className="grid grid-cols-3 gap-4 text-sm mt-2">
              {lambert.nig && <div><div className="font-semibold">NIG: {(lambert.nig.ETL_1*100).toFixed(2)}%</div><div className="text-xs text-gray-500">Lambert</div></div>}
              {lambert.ghst && <div><div className="font-semibold">GHST: {(lambert.ghst.ETL_1*100).toFixed(2)}%</div><div className="text-xs text-gray-500">Lambert</div></div>}
              {lambert.evar && <div><div className="font-semibold">EVaR: {(lambert.evar.ETL_1*100).toFixed(2)}%</div><div className="text-xs text-gray-500">Lambert</div></div>}
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass p-4 rounded border border-white/20">
          <h3 className="text-lg font-semibold">CVaR α = 50%</h3>
          {state.accepted ? (
            fullCvar ? (
              <div className="grid gap-2">
                <CvarMetric label="NIG" value={data50?.annual?.nig} />
                <CvarMetric label="GHST" value={data50?.annual?.ghst} />
                <CvarMetric label="EVaR" value={data50?.annual?.evar} />
              </div>
            ) : (
              <CvarMetric label="CVaR" value={worst(data50?.annual)} />
            )
          ) : (
            <div className="grid gap-2">
              <Masked className="p-3 rounded-lg bg-red-900/20 border border-white/10" scramble blur>−00.00%</Masked>
              {!fullCvar ? null : <>
                <Masked className="p-3 rounded-lg bg-red-900/20 border border-white/10" scramble blur>−00.00%</Masked>
                <Masked className="p-3 rounded-lg bg-red-900/20 border border-white/10" scramble blur>−00.00%</Masked>
              </>}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">As of: {state.accepted ? fmtDate(data50?.as_of) : <Masked inline scramble blur>00 Jan 0000</Masked>}</div>
        </div>
        <div className="glass p-4 rounded border border-white/20">
          <h3 className="text-lg font-semibold">CVaR α = 95%</h3>
          {state.accepted ? (
            fullCvar ? (
              <div className="grid gap-2">
                <CvarMetric label="NIG" value={data95?.annual?.nig} />
                <CvarMetric label="GHST" value={data95?.annual?.ghst} />
                <CvarMetric label="EVaR" value={data95?.annual?.evar} />
              </div>
            ) : (
              <CvarMetric label="CVaR" value={worst(data95?.annual)} />
            )
          ) : (
            <div className="grid gap-2">
              <Masked className="p-3 rounded-lg bg-red-900/20 border border-white/10" scramble blur>−00.00%</Masked>
              {!fullCvar ? null : <>
                <Masked className="p-3 rounded-lg bg-red-900/20 border border-white/10" scramble blur>−00.00%</Masked>
                <Masked className="p-3 rounded-lg bg-red-900/20 border border-white/10" scramble blur>−00.00%</Masked>
              </>}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">As of: {state.accepted ? fmtDate(data95?.as_of) : <Masked inline scramble blur>00 Jan 0000</Masked>}</div>
        </div>
        <div className="glass p-4 rounded border border-white/20">
          <h3 className="text-lg font-semibold">CVaR α = 99%</h3>
          {state.accepted ? (
            fullCvar ? (
              <div className="grid gap-2">
                <CvarMetric label="NIG" value={data99?.annual?.nig} />
                <CvarMetric label="GHST" value={data99?.annual?.ghst} />
                <CvarMetric label="EVaR" value={data99?.annual?.evar} />
              </div>
            ) : (
              <CvarMetric label="CVaR" value={worst(data99?.annual)} />
            )
          ) : (
            <div className="grid gap-2">
              <Masked className="p-3 rounded-lg bg-red-900/20 border border-white/10" scramble blur>−00.00%</Masked>
              {!fullCvar ? null : <>
                <Masked className="p-3 rounded-lg bg-red-900/20 border border-white/10" scramble blur>−00.00%</Masked>
                <Masked className="p-3 rounded-lg bg-red-900/20 border border-white/10" scramble blur>−00.00%</Masked>
              </>}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">As of: {state.accepted ? fmtDate(data99?.as_of) : <Masked inline scramble blur>00 Jan 0000</Masked>}</div>
        </div>
      </div>
    </div>
  );
}


