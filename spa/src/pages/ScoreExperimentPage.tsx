import { useState } from 'react';
import { getJSON, postJSON } from '@services/http';

type ScoredItem = {
  symbol: string;
  name?: string | null;
  country?: string | null;
  compass_score?: number | null;
  return_annual?: number | null;
  cvar_worst?: number | null;
};

type AnchorMeta = {
  category: string;
  version: string;
  mu_low: number;
  mu_high: number;
};

type TopResponse = {
  items?: ScoredItem[];
  count?: number;
  anchor?: string;
  anchor_params?: AnchorMeta | null;
};

export default function ScoreExperimentPage() {
  const [baseItems, setBaseItems] = useState<ScoredItem[]>([]);
  const [usMfEtfItems, setUsMfEtfItems] = useState<ScoredItem[]>([]);
  const [caMfEtfItems, setCaMfEtfItems] = useState<ScoredItem[]>([]);
  const [allMfEtfItems, setAllMfEtfItems] = useState<ScoredItem[]>([]);
  const [allMfEtfCanadaOnlyItems, setAllMfEtfCanadaOnlyItems] = useState<ScoredItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [lt, setLt] = useState<string>('0.25');
  const [alpha, setAlpha] = useState<string>('0.99');
  const [busySym, setBusySym] = useState<string | null>(null);

  const [metaBase, setMetaBase] = useState<AnchorMeta | null>(null);
  const [metaUs, setMetaUs] = useState<AnchorMeta | null>(null);
  const [metaCa, setMetaCa] = useState<AnchorMeta | null>(null);
  const [metaAll, setMetaAll] = useState<AnchorMeta | null>(null);
  const [metaAllCanada, setMetaAllCanada] = useState<AnchorMeta | null>(null);

  const ensureCalibrated = async () => {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 120000);
      await postJSON('/experiments/anchors/calibrate', undefined, { signal: ctrl.signal });
      clearTimeout(t);
    } catch {
      // ignore
    }
  };

  const alphaToLabel = (a: string) => {
    const v = parseFloat(a || '0.99');
    if (Math.abs(v - 0.5) < 1e-6) return '50';
    if (Math.abs(v - 0.95) < 1e-6) return '95';
    return '99';
  };

  const showTop20 = async () => {
    setLoading(true);
    try {
      await ensureCalibrated();
      const fetchTop = async (params: Record<string,string>): Promise<TopResponse> => {
        const sp = new URLSearchParams(params);
        sp.set('limit','20');
        return getJSON<TopResponse>(`/experiments/top?${sp.toString()}`);
      };
      const ltParam = String(parseFloat(lt || '0.25') || 0.25);
      const alphaParam = alphaToLabel(alpha);
      const [b, us, ca, all, allCa] = await Promise.all([
        fetchTop({ anchor: 'GLOBAL:ALL', lt: ltParam, alpha: alphaParam }),
        fetchTop({ anchor: 'GLOBAL:US-MUTUAL-FUND-ETF', country: 'US', types: 'Mutual Fund,ETF', lt: ltParam, alpha: alphaParam }),
        fetchTop({ anchor: 'GLOBAL:Canada-MUTUAL-FUND-ETF', country: 'Canada', types: 'Mutual Fund,ETF', lt: ltParam, alpha: alphaParam }),
        fetchTop({ anchor: 'GLOBAL:ALL-MUTUAL-FUND-ETF', types: 'Mutual Fund,ETF', lt: ltParam, alpha: alphaParam }),
        fetchTop({ anchor: 'GLOBAL:ALL-MUTUAL-FUND-ETF', country: 'Canada', types: 'Mutual Fund,ETF', lt: ltParam, alpha: alphaParam }),
      ]);
      setBaseItems(b.items || []);
      setUsMfEtfItems(us.items || []);
      setCaMfEtfItems(ca.items || []);
      setAllMfEtfItems(all.items || []);
      setAllMfEtfCanadaOnlyItems(allCa.items || []);
      setMetaBase(b.anchor_params || null);
      setMetaUs(us.anchor_params || null);
      setMetaCa(ca.anchor_params || null);
      setMetaAll(all.anchor_params || null);
      setMetaAllCanada(allCa.anchor_params || null);
      setHasData(true);
    } finally { setLoading(false); }
  };

  const Header = () => (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300">LT</span>
        <input
          type="number"
          step="0.01"
          min="0.01"
          className="px-3 py-2 rounded bg-black/30 border border-white/10 w-32"
          value={lt}
          onChange={(e)=> setLt(e.target.value)}
          placeholder="0.25"
          aria-label="Loss Tolerance (LT)"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300">Based on α</span>
        <select
          value={alpha}
          onChange={(e)=> setAlpha(e.target.value)}
          className="px-3 py-2 rounded bg-black/30 border border-white/10"
          aria-label="Alpha level"
        >
          <option value="0.50">0.50</option>
          <option value="0.95">0.95</option>
          <option value="0.99">0.99</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={showTop20} disabled={loading} className="px-4 py-2 bg-blue-600 rounded disabled:opacity-60">{loading ? 'Working…' : (hasData ? 'Refresh Top‑20' : 'Show Top‑20')}</button>
      </div>
    </div>
  );

  const recalcSymbol = async (sym: string) => {
    try {
      setBusySym(sym);
      const sp = new URLSearchParams({
        products: sym,
        local: 'true',
        force: 'true',
        ready_only: 'true',
      });
      await postJSON(`/cvar/recalc_all?${sp.toString()}`);
    } finally {
      setBusySym((s) => (s === sym ? null : s));
    }
  };

  const MetaLine = ({ meta }: { meta: AnchorMeta | null }) => (
    <div className="text-xs text-gray-400 mb-2">
      {meta ? (
        <>
          <span>Anchor: </span>
          <span className="text-gray-300">{meta.category}</span>
          <span> (v {meta.version}) • μ_low=</span>
          <span className="text-gray-300">{meta.mu_low.toFixed(4)}</span>
          <span> • μ_high=</span>
          <span className="text-gray-300">{meta.mu_high.toFixed(4)}</span>
        </>
      ) : (
        <span className="text-gray-500">Anchor parameters will appear here after fetch</span>
      )}
    </div>
  );

  const NameCell = (it: ScoredItem) => {
    const nm = (it.name || '').trim();
    const co = (it.country || '').trim();
    const label = nm && co ? `${nm} (${it.symbol}, ${co})`
      : (nm ? `${nm} (${it.symbol})` : (co ? `${it.symbol} (${co})` : it.symbol));
    return (
      <div className="flex items-center gap-2">
        <span>{label}</span>
        <button
          onClick={() => recalcSymbol(it.symbol)}
          disabled={busySym === it.symbol}
          className="px-2 py-0.5 text-xs rounded border border-white/10 hover:bg-white/10 disabled:opacity-60"
          aria-label={`Recalculate CVaR for ${it.symbol}`}
          title="Recalculate CVaR"
        >
          {busySym === it.symbol ? '…' : 'Recalc'}
        </button>
      </div>
    );
  };

  const Table = ({ title, items, meta }: { title: string; items: ScoredItem[]; meta: AnchorMeta | null }) => (
    <div className="glass p-4 rounded border border-white/10">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <MetaLine meta={meta} />
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-gray-400">
            <tr>
              <th className="text-left p-2">Name (Symbol, Country)</th>
              <th className="text-left p-2">Compass Score</th>
              <th className="text-left p-2">Annual return</th>
              <th className="text-left p-2">CVaR</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.symbol} className="border-t border-white/5">
                <td className="p-2">{NameCell(it)}</td>
                <td className="p-2 font-semibold">{it.compass_score == null ? '-' : it.compass_score}</td>
                <td className="p-2">{it.return_annual == null ? '-' : (Number(it.return_annual) * 100).toFixed(2) + '%'}</td>
                <td className="p-2">{it.cvar_worst == null ? '-' : '-' + (Number(it.cvar_worst) * 100).toFixed(2) + '%'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <main className="mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2 trajan-text">Compass Score - Experiment</h1>
      <Header />
      <div className="grid md:grid-cols-4 gap-4 mt-4">
        {/* <Table
          title="Anchors calibrated on the whole universe, including junk stocks worldwide (anchor GLOBAL:ALL)"
          items={baseItems}
          meta={metaBase}
        /> */}
        <Table
          title="Anchors calibrated by Country (US) for Harvard release (Mutual Funds, ETFs) (anchor GLOBAL:US-MUTUAL-FUND-ETF)"
          items={usMfEtfItems}
          meta={metaUs}
        />
        <Table
          title="Anchors calibrated by Country (Canada) for Harvard release (Mutual Funds, ETFs) (anchor GLOBAL:Canada-MUTUAL-FUND-ETF)"
          items={caMfEtfItems}
          meta={metaCa}
        />
        <Table
          title="Anchors calibrated for Harvard release worldwide (Mutual Funds, ETFs) (anchor GLOBAL:ALL-MUTUAL-FUND-ETF)"
          items={allMfEtfItems}
          meta={metaAll}
        />
        <Table
          title="Anchors calibrated for Harvard release worldwide (Mutual Funds, ETFs) (anchor GLOBAL:ALL-MUTUAL-FUND-ETF), filtered by Canada only"
          items={allMfEtfCanadaOnlyItems}
          meta={metaAllCanada}
        />
      </div>
    </main>
  );
}


