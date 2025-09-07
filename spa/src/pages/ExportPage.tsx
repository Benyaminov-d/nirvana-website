import { useEffect, useMemo, useState } from 'react';

type ColumnsToggle = {
  as_of: boolean;
  start_date: boolean;
  years: boolean;
  alpha: boolean;
  cvar_nig: boolean;
  cvar_ghst: boolean;
  cvar_evar: boolean;
  cvar: boolean; // worst
};

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-t ${active ? 'bg-gray-800 text-white' : 'bg-gray-700 text-gray-300'}`}>{children}</button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass p-4 rounded-b border border-white/10">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function ExportPage() {
  const [tab, setTab] = useState<'cvar' | 'ts'>('cvar');

  // CVaR tab state
  const [symbols, setSymbols] = useState('all');
  const [alpha50, setA50] = useState(true);
  const [alpha95, setA95] = useState(true);
  const [alpha99, setA99] = useState(true);
  const [latest, setLatest] = useState(true);
  const [oneRow, setOneRow] = useState(false);
  const [mode, setMode] = useState<'levels'|'worst'>('levels');
  const [excludeOpen, setExcludeOpen] = useState(false);
  const [exclude, setExclude] = useState('');
  const [sort, setSort] = useState('name_asc');
  const [cols, setCols] = useState<ColumnsToggle>({
    as_of: true,
    start_date: true,
    years: true,
    alpha: true,
    cvar_nig: true,
    cvar_ghst: true,
    cvar_evar: true,
    cvar: false,
  });
  const worstOnly = mode==='worst';

  // Sync columns with mode (mirror legacy behavior)
  useEffect(() => {
    setCols((prev) => ({ ...prev, cvar: worstOnly ? true : false }));
  }, [worstOnly]);

  const href = useMemo(()=>{
    const parts: string[] = [];
    const levels = [alpha50 && '50', alpha95 && '95', alpha99 && '99'].filter(Boolean).join(',');
    if (levels) parts.push(`levels=${levels}`);
    if (symbols.trim() && symbols.trim().toLowerCase() !== 'all') parts.push(`products=${encodeURIComponent(symbols.trim())}`);
    if (latest) parts.push('latest=1');
    if (oneRow) parts.push('one_row=1');
    if (worstOnly) parts.push('worst_only=1');
    const autoEx: string[] = [];
    if (!oneRow) {
      if (worstOnly) {
        // include cvar only if checked; always exclude families when worstOnly
        if (!cols.cvar) autoEx.push('cvar');
        autoEx.push('cvar_nig','cvar_ghst','cvar_evar');
      } else {
        // exclude worst column when families selected
        autoEx.push('cvar');
        if (!cols.cvar_nig) autoEx.push('cvar_nig');
        if (!cols.cvar_ghst) autoEx.push('cvar_ghst');
        if (!cols.cvar_evar) autoEx.push('cvar_evar');
      }
      if (!cols.as_of) autoEx.push('as_of');
      if (!cols.start_date) autoEx.push('start_date');
      if (!cols.years) autoEx.push('years');
      if (!cols.alpha) autoEx.push('alpha');
    }
    const allEx = [exclude.trim(), autoEx.join(',')].filter(Boolean).join(',');
    if (allEx) parts.push(`exclude=${encodeURIComponent(allEx)}`);
    if (sort) parts.push(`sort=${encodeURIComponent(sort)}`);
    return `/api/export/cvars.csv?${parts.join('&')}`;
  }, [symbols, alpha50, alpha95, alpha99, latest, oneRow, worstOnly, exclude, sort, cols]);

  // Timeseries tab state
  const [tsSymbols, setTsSymbols] = useState('BTC,ETH');
  const tsHref = useMemo(()=>{
    const syms = tsSymbols.split(',').map(s=>s.trim()).filter(Boolean);
    const list = syms.join(',');
    return `/api/export/timeseries?products=${encodeURIComponent(list)}`;
  }, [tsSymbols]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'TrajanPro, Times New Roman, serif' }}>Nirvana App - Export</h1>
        <p className="text-xs text-gray-400">Secure export tools (auth required)</p>
      </header>
      <div className="flex gap-2 mb-0">
        <TabButton active={tab==='cvar'} onClick={()=>setTab('cvar')}>CVaR CSV</TabButton>
        <TabButton active={tab==='ts'} onClick={()=>setTab('ts')}>Time Series</TabButton>
      </div>

      {tab==='cvar' ? (
        <Section title="CVaR snapshots (latest as-of)">
          <label className="block mb-3">
            <div className="text-xs text-gray-300 mb-1 uppercase tracking-wider">Tickers (comma-separated), 'all' or '5STARS' / '5STARSUS' / '5STARSCA'</div>
            <input value={symbols} onChange={(e)=>setSymbols(e.target.value)} className="w-full px-3 py-2 bg-[#2d2d2d] border border-gray-600 rounded" placeholder="all | 5STARS | 5STARSUS | 5STARSCA | e.g. BTC,ETH,SP500TR" />
          </label>
          <div className="mb-3">
            <div className="text-xs text-gray-400 mb-1">CVaR by levels</div>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={alpha50} onChange={(e)=>setA50(e.target.checked)} /> 50</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={alpha95} onChange={(e)=>setA95(e.target.checked)} /> 95</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={alpha99} onChange={(e)=>setA99(e.target.checked)} /> 99</label>
            </div>
          </div>
          <div className="mb-3">
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={worstOnly} onChange={(e)=>setMode(e.target.checked ? 'worst' : 'levels')} /> Worst only</label>
            <div className="text-xs text-gray-500 mt-1">If enabled, only the worst-of-three CVaR per level will be exported.</div>
          </div>
          <div className="mb-3">
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={latest} onChange={(e)=>setLatest(e.target.checked)} /> Latest only</label>
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={oneRow} onChange={(e)=>setOneRow(e.target.checked)} /> One row per symbol</label>
          </div>
          <div className="mb-4">
            <button type="button" onClick={()=>setExcludeOpen(!excludeOpen)} className="text-sm text-blue-400 hover:text-blue-300">
              {excludeOpen ? 'Hide column selection' : 'Show column selection'}
            </button>
            {excludeOpen && (
              <div className="mt-2 p-3 bg-black/60 border border-gray-800 rounded">
                <div className="text-xs text-gray-400 mb-2">Toggle columns (applies to non one-row mode). Some options are disabled based on current mode.</div>
                <div className="flex flex-wrap gap-4 mb-2 text-sm">
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={cols.as_of} onChange={(e)=>setCols({...cols, as_of: e.target.checked})} /> as_of</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={cols.start_date} onChange={(e)=>setCols({...cols, start_date: e.target.checked})} /> start_date</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={cols.years} onChange={(e)=>setCols({...cols, years: e.target.checked})} /> years</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={cols.alpha} onChange={(e)=>setCols({...cols, alpha: e.target.checked})} disabled={oneRow} /> alpha</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={cols.cvar_nig} onChange={(e)=>setCols({...cols, cvar_nig: e.target.checked})} disabled={oneRow || worstOnly} /> cvar_nig</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={cols.cvar_ghst} onChange={(e)=>setCols({...cols, cvar_ghst: e.target.checked})} disabled={oneRow || worstOnly} /> cvar_ghst</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={cols.cvar_evar} onChange={(e)=>setCols({...cols, cvar_evar: e.target.checked})} disabled={oneRow || worstOnly} /> cvar_evar</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={cols.cvar} onChange={(e)=>setCols({...cols, cvar: e.target.checked})} disabled={mode!=='worst' || (oneRow && !worstOnly)} /> cvar (worst)</label>
                </div>
                <div className="text-xs text-gray-400 mb-2">Additionally specify column names to exclude (comma-separated). For one-row mode, use suffixed names like cvar_nig_95 or cvar_95.</div>
                <input value={exclude} onChange={(e)=>setExclude(e.target.value)} className="w-full px-3 py-2 bg-[#2d2d2d] border border-gray-600 rounded" placeholder="Columns to exclude (comma-separated)" />
              </div>
            )}
          </div>
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-1">Sort by</div>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="inline-flex items-center gap-2"><input type="radio" name="sort" checked={sort==='name_asc'} onChange={()=>setSort('name_asc')} /> Name A→Z</label>
              <label className="inline-flex items-center gap-2"><input type="radio" name="sort" checked={sort==='name_desc'} onChange={()=>setSort('name_desc')} /> Name Z→A</label>
              <label className="inline-flex items-center gap-2"><input type="radio" name="sort" checked={sort==='cvar_desc'} onChange={()=>setSort('cvar_desc')} /> CVaR High→Low</label>
              <label className="inline-flex items-center gap-2"><input type="radio" name="sort" checked={sort==='cvar_asc'} onChange={()=>setSort('cvar_asc')} /> CVaR Low→High</label>
            </div>
          </div>
          <a href={href} className="inline-block bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white" download>Download CSV</a>
        </Section>
      ) : (
        <Section title="Time series (EODHD)">
          <label className="block mb-3">
            <div className="text-xs text-gray-300 mb-1 uppercase tracking-wider">Tickers (comma-separated)</div>
            <input value={tsSymbols} onChange={(e)=>setTsSymbols(e.target.value)} className="w-full px-3 py-2 bg-[#2d2d2d] border border-gray-600 rounded" placeholder="BTC,ETH,SP500TR" />
          </label>
          <p className="text-xs text-gray-400 mb-3">One ticker returns CSV; multiple return a ZIP with one CSV per ticker.</p>
          <a href={tsHref} className="inline-block bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white" download>Download</a>
        </Section>
      )}
    </div>
  );
}


