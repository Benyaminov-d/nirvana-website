import { useEffect, useMemo, useState } from 'react';
import { searchProducts, fetchCountries } from '@services/products';
import Masked from '../components/Masked';
import { useCompliance } from '../context/ComplianceContext';

export default function ProductsPage() {
  const { state } = useCompliance();
  const [tolerance, setTolerance] = useState(0.25);
  const [alpha, setAlpha] = useState(99);
  const [fiveStars, setFiveStars] = useState(false);
  
  // Auto-select user's region by default
  const userCountry = useMemo(() => {
    if (!state.accepted || !state.region) return '';
    
    // Map regions to country codes for API calls
    const regionToCountryMap: Record<string, string> = {
      'US': 'US',
      'CA': 'CA', 
      'UK': 'UK',
      'EU': 'EU',
      'CN': 'CN',
      'IN': 'IN',
      'CH': 'CH',
      'JP': 'JP',
      'OTHER': '' // fallback to empty for other regions
    };
    
    return regionToCountryMap[state.region] || '';
  }, [state.accepted, state.region]);

  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const query = useMemo(()=> ({ tolerance, alpha, five_stars: fiveStars, limit: 20, country }), [tolerance, alpha, fiveStars, country]);
  
  // Set user's country as default when it becomes available
  useEffect(() => {
    if (userCountry && !country) {
      setCountry(userCountry);
    }
  }, [userCountry, country]);

  useEffect(()=>{ fetchCountries().then(setCountries).catch(()=>{}); },[]);

  const run = async () => {
    setLoading(true);
    try {
      const data = await searchProducts(query);
      setRows(data.items || []);
    } finally { setLoading(false); }
  };

  return (
    <div className="glass p-4 rounded border border-white/10">
      <h2 className="text-lg font-semibold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
        <label className="text-sm">Tolerance
          <input className="w-full bg-[#2d2d2d] border border-gray-600 rounded px-3 py-2" value={tolerance} onChange={e=> setTolerance(parseFloat(e.target.value))} />
        </label>
        <label className="text-sm">Alpha
          <select className="w-full bg-[#2d2d2d] border border-gray-600 rounded px-3 py-2" value={alpha} onChange={e=> setAlpha(parseInt(e.target.value))}>
            <option value={95}>95</option>
            <option value={99}>99</option>
          </select>
        </label>
        <label className="text-sm">Five Stars
          <input type="checkbox" className="ml-2" checked={fiveStars} onChange={e=> setFiveStars(e.target.checked)} />
        </label>
        <label className="text-sm">Country
          <select className="w-full bg-[#2d2d2d] border border-gray-600 rounded px-3 py-2" value={country} onChange={e=> setCountry(e.target.value)}>
            <option value="">All countries</option>
            {countries.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <div className="flex items-end">
          <button onClick={run} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white disabled:opacity-60" disabled={loading}>{loading? 'Running…' : 'Run'}</button>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="p-2">Symbol</th>
              <th className="p-2">Name</th>
              <th className="p-2">Return</th>
              <th className="p-2">CVaR</th>
              <th className="p-2">Compass</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((it)=> (
              <tr key={`${it.symbol}`}>
                <td className="p-2">
                  {state.accepted ? it.symbol : (
                    <Masked inline scramble blur>
                      {String(it.symbol || '')}
                    </Masked>
                  )}
                </td>
                <td className="p-2 text-gray-300 truncate">
                  {state.accepted ? (it.name ?? '') : (
                    <Masked inline scramble blur>
                      {String(it.name || '')}
                    </Masked>
                  )}
                </td>
                <td className="p-2">
                  {state.accepted ? (typeof it.return_annual === 'number' ? `${(it.return_annual*100).toFixed(1)}%` : '-') : (
                    <Masked inline scramble blur>
                      {typeof it.return_annual === 'number' ? `${(it.return_annual*100).toFixed(1)}%` : '-'}
                    </Masked>
                  )}
                </td>
                <td className="p-2">
                  {state.accepted ? (typeof it.cvar_worst === 'number' ? `${(it.cvar_worst*100).toFixed(1)}%` : '-') : (
                    <Masked inline scramble blur>
                      {typeof it.cvar_worst === 'number' ? `${(it.cvar_worst*100).toFixed(1)}%` : '-'}
                    </Masked>
                  )}
                </td>
                <td className="p-2 nv-score nv-score--sm">
                  {state.accepted ? (it.compass_score ?? '-') : (
                    <Masked inline scramble blur>
                      {String(it.compass_score ?? '-')}
                    </Masked>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


