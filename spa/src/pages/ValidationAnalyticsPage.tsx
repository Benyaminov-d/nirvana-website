import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  fetchValidationSummary, 
  searchValidationFlags, 
  fetchDatabaseStatus,
  fetchInstrumentTypes,
  fetchWhatIfAnalysis,
  ValidationSummary,
  ValidationSearchParams,
  ValidationSearchResult,
  DatabaseStatus,
  WhatIfAnalysis,
  FLAG_CATEGORIES,
  FLAG_DESCRIPTIONS,
  getCategoryForFlag,
  getFlagDescription
} from '@services/validation';
import Masked from '../components/Masked';
import { useCompliance } from '../context/ComplianceContext';

export default function ValidationAnalyticsPage() {
  const { state } = useCompliance();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'summary' | 'search'>('summary');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Summary data
  const [summary, setSummary] = useState<ValidationSummary | null>(null);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  
  // What-if analysis data
  const [whatIfData, setWhatIfData] = useState<WhatIfAnalysis | null>(null);
  const [whatIfYears, setWhatIfYears] = useState<number>(10); // Default to current threshold
  const [whatIfLoading, setWhatIfLoading] = useState<boolean>(false);
  
  // Global filters (shared between Summary and Search tabs)
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedInstrumentTypes, setSelectedInstrumentTypes] = useState<string[]>([]);
  const [availableInstrumentTypes, setAvailableInstrumentTypes] = useState<string[]>(['ETF', 'Fund']);
  
  // Search data
  const [searchResults, setSearchResults] = useState<ValidationSearchResult | null>(null);
  const [internalSearchParams, setInternalSearchParams] = useState<ValidationSearchParams>({
    limit: 50,
    offset: 0,
    sort_by: 'symbol',     // Default sort by symbol
    sort_order: 'asc'      // Default alphabetical order
  });
  
  // Load available instrument types on component mount
  useEffect(() => {
    const loadInstrumentTypes = async () => {
      try {
        const types = await fetchInstrumentTypes();
        setAvailableInstrumentTypes(types);
      } catch (error) {
        console.warn('Failed to load instrument types:', error);
        // Keep fallback types
      }
    };
    loadInstrumentTypes();
  }, []);

  
  // Initialize from URL parameters
  useEffect(() => {
    const country = searchParams.get('country') || '';
    const instrumentTypesParam = searchParams.get('instrument_types') || '';
    const instrumentTypes = instrumentTypesParam.split(',').filter(Boolean);
    const tab = searchParams.get('tab') as 'summary' | 'search' || 'summary';
    
    setSelectedCountry(country);
    setSelectedInstrumentTypes(instrumentTypes);
    setActiveTab(tab);
    
    // Initialize search params from URL
    const flags = searchParams.get('flags')?.split(',').filter(Boolean) || [];
    const valid = searchParams.get('valid') === 'true' ? true : searchParams.get('valid') === 'false' ? false : undefined;
    const hasWarnings = searchParams.get('has_warnings') === 'true' ? true : searchParams.get('has_warnings') === 'false' ? false : undefined;
    const symbolSearch = searchParams.get('symbol_search') || '';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    setInternalSearchParams({
      limit,
      offset,
      country: country || undefined,
      instrument_types: instrumentTypes.length > 0 ? instrumentTypes : undefined,
      valid,
      has_warnings: hasWarnings,
      flags: flags.length > 0 ? flags : undefined,
      symbol_search: symbolSearch || undefined
    });
  }, [searchParams]);

  // Load initial data
  useEffect(() => {
    loadSummaryData();
  }, []);

  // Reload data when filters change
  useEffect(() => {
    if (activeTab === 'summary') {
      loadSummaryData();
    } else if (activeTab === 'search') {
      loadSearchData();
    }
  }, [selectedCountry, selectedInstrumentTypes, activeTab]);

  // Update URL parameters when filters change
  const updateUrlParams = useCallback((updates: Record<string, string | string[] | undefined | null>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.set(key, value.join(','));
      } else {
        newParams.set(key, value);
      }
    });
    
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);
  
  const loadSummaryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, statusData] = await Promise.all([
        fetchValidationSummary(selectedCountry || undefined, selectedInstrumentTypes.length > 0 ? selectedInstrumentTypes : undefined),
        fetchDatabaseStatus(selectedCountry || undefined, selectedInstrumentTypes.length > 0 ? selectedInstrumentTypes : undefined)
      ]);
      setSummary(summaryData);
      setDbStatus(statusData);
    } catch (error) {
      console.error('Failed to load summary data:', error);
      setError('Failed to load summary data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const loadWhatIfAnalysis = async () => {
    setWhatIfLoading(true);
    try {
      const whatIfResult = await fetchWhatIfAnalysis(
        whatIfYears,
        selectedCountry || undefined, 
        selectedInstrumentTypes.length > 0 ? selectedInstrumentTypes : undefined
      );
      setWhatIfData(whatIfResult);
    } catch (err) {
      console.error('Failed to load what-if analysis:', err);
      // Don't show error for what-if as it's supplementary
    } finally {
      setWhatIfLoading(false);
    }
  };

  const loadSearchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchValidationFlags(internalSearchParams);
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to load search data:', error);
      setError('Failed to load search data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  

  
  // Auto-search when params change
  useEffect(() => {
    if (activeTab === 'search') {
      loadSearchData();
    }
  }, [internalSearchParams, activeTab]);
  
  const updateSearchParam = useCallback((key: keyof ValidationSearchParams, value: any) => {
    setInternalSearchParams(prev => {
      const newParams = { ...prev, [key]: value };
      // Reset offset when changing search criteria (but not for limit/offset changes)
      if (key !== 'offset' && key !== 'limit') {
        newParams.offset = 0;
      }
      
      // Update URL parameters
      const urlUpdates: Record<string, string | undefined | null> = {};
      if (key === 'valid') {
        urlUpdates.valid = value?.toString() || null;
      } else if (key === 'has_warnings') {
        urlUpdates.has_warnings = value?.toString() || null;
      } else if (key === 'flags') {
        urlUpdates.flags = Array.isArray(value) && value.length > 0 ? value.join(',') : null;
      } else if (key === 'instrument_types') {
        urlUpdates.instrument_types = Array.isArray(value) && value.length > 0 ? value.join(',') : null;
      } else if (key === 'symbol_search') {
        urlUpdates.symbol_search = value || null;
      } else if (key === 'limit') {
        urlUpdates.limit = value?.toString() || null;
      } else if (key === 'offset') {
        urlUpdates.offset = value?.toString() || null;
      } else if (key === 'sort_by') {
        urlUpdates.sort_by = value || null;
      } else if (key === 'sort_order') {
        urlUpdates.sort_order = value || null;
      }
      
      updateUrlParams(urlUpdates);
      
      return newParams;
    });
  }, [updateUrlParams]);

  // Navigate to search with specific filters
  const navigateToSearch = useCallback((filters: Partial<ValidationSearchParams>) => {
    const newSearchParams = {
      limit: 50,
      offset: 0,
      country: selectedCountry || undefined,
      instrument_types: selectedInstrumentTypes.length > 0 ? selectedInstrumentTypes : undefined,
      ...filters
    };
    
    setInternalSearchParams(newSearchParams);
    setActiveTab('search');
    
    // Update URL with search parameters and tab
    const urlParams: Record<string, string | undefined | null> = {
      tab: 'search',
      country: selectedCountry || null,
      instrument_types: selectedInstrumentTypes.length > 0 ? selectedInstrumentTypes.join(',') : null,
      limit: newSearchParams.limit?.toString() || null,
      offset: newSearchParams.offset?.toString() || null,
      valid: newSearchParams.valid?.toString() || null,
      has_warnings: newSearchParams.has_warnings?.toString() || null,
      flags: newSearchParams.flags?.join(',') || null,
      symbol_search: newSearchParams.symbol_search || null
    };
    
    updateUrlParams(urlParams);
  }, [selectedCountry, selectedInstrumentTypes, updateUrlParams]);

  // Handle column header sorting
  const handleSort = useCallback((column: string) => {
    const currentSort = internalSearchParams.sort_by;
    const currentOrder = internalSearchParams.sort_order || 'asc';
    
    let newOrder: string;
    if (currentSort === column) {
      // If clicking the same column, toggle the order
      newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // If clicking a different column, start with ascending
      newOrder = 'asc';
    }
    
    updateSearchParam('sort_by', column);
    updateSearchParam('sort_order', newOrder);
  }, [internalSearchParams.sort_by, internalSearchParams.sort_order, updateSearchParam]);

  // Handle Net Change click - navigate to search with currently invalid symbols
  const handleNetChangeClick = useCallback(() => {
    if (!whatIfData || whatIfData.improvement.additional_valid === 0) return;
    
    // Navigate to search showing currently invalid symbols that could potentially become valid
    navigateToSearch({
      valid: false, // Show currently invalid symbols
      limit: 100    // Show more results since we're looking at potentially changing symbols
    });
  }, [whatIfData, navigateToSearch]);
  
  // Use percentage data from API
  // Helper function to get country suffix for EODHD
  const getCountrySuffix = (country: string): string => {
    const suffixMap: Record<string, string> = {
      'Canada': '.TO',
      'UK': '.L', 
      'Italy': '.MI',
      'US': '' // No suffix for US
    };
    return suffixMap[country] || '.US'; // Default fallback
  };
  
  // Download TimeSeries function for individual symbol
  const downloadSingleTimeSeries = (symbol: string, country: string) => {
    const suffix = getCountrySuffix(country);
    const symbolWithSuffix = `${symbol}${suffix}`;
    
    const url = `https://eodhistoricaldata.com/api/eod/${symbolWithSuffix}?api_token=68920eb68e7411.70650632&fmt=csv`;
    window.open(url, '_blank');
  };

  const summaryStats = useMemo(() => {
    if (!summary) return null;
    
    return {
      validPercentage: (summary.valid_percentage || 0).toFixed(1),
      invalidPercentage: (summary.invalid_percentage || 0).toFixed(1),
      validatedPercentage: (summary.validated_percentage || 0).toFixed(1),
      historicalFailuresPercentage: (summary.historical_failures_percentage || 0).toFixed(1),
      structuralFailuresPercentage: (summary.structural_failures_percentage || 0).toFixed(1),
      liquidityWarningsPercentage: (summary.liquidity_warnings_percentage || 0).toFixed(1),
      statisticalFailuresPercentage: (summary.statistical_failures_percentage || 0).toFixed(1)
    };
  }, [summary]);

  return (
    <div className="glass p-6 rounded border border-white/10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-white">
        Data Validation Analytics
      </h1>
      
      {/* Global Filters */}
      <div className="bg-gray-800/50 p-4 rounded border border-gray-600 mb-6">
        <h3 className="text-lg font-medium mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Country Filter */}
          <div>
            <label htmlFor="global-country-filter" className="text-sm font-medium text-gray-300 block mb-2">
              Country:
            </label>
            <select
              id="global-country-filter"
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                updateUrlParams({ country: e.target.value, tab: activeTab });
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Countries</option>
              {dbStatus?.countries_available && dbStatus.countries_available.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          
          {/* Instrument Type Filter - Multi-select */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">
              Instrument Types:
            </label>
            <div className="bg-gray-700 border border-gray-600 rounded px-3 py-2 max-h-32 overflow-y-auto">
              {availableInstrumentTypes.map(type => (
                <label key={type} className="flex items-center text-sm text-gray-200 py-1">
                  <input
                    type="checkbox"
                    checked={selectedInstrumentTypes.includes(type)}
                    onChange={(e) => {
                      const newTypes = e.target.checked 
                        ? [...selectedInstrumentTypes, type]
                        : selectedInstrumentTypes.filter(t => t !== type);
                      setSelectedInstrumentTypes(newTypes);
                      updateUrlParams({ instrument_types: newTypes.length > 0 ? newTypes.join(',') : null, tab: activeTab });
                    }}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
          
          {/* Clear Filters */}
          <div className="flex items-end">
            {(selectedCountry || selectedInstrumentTypes.length > 0) && (
              <button
                onClick={() => {
                  setSelectedCountry('');
                  setSelectedInstrumentTypes([]);
                  updateUrlParams({ country: null, instrument_types: null, tab: activeTab });
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(selectedCountry || selectedInstrumentTypes.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm text-gray-400">Active filters:</span>
            {selectedCountry && (
              <span className="text-xs px-2 py-1 bg-blue-600 rounded text-white flex items-center gap-1">
                Country: {selectedCountry}
                <button
                  onClick={() => {
                    setSelectedCountry('');
                    updateUrlParams({ country: null, tab: activeTab });
                  }}
                  className="hover:bg-blue-700 rounded text-white ml-1"
                  title="Remove country filter"
                >
                  ×
                </button>
              </span>
            )}
            {selectedInstrumentTypes.map(type => (
              <span key={type} className="text-xs px-2 py-1 bg-green-600 rounded text-white flex items-center gap-1">
                {type}
                <button
                  onClick={() => {
                    const newTypes = selectedInstrumentTypes.filter(t => t !== type);
                    setSelectedInstrumentTypes(newTypes);
                    updateUrlParams({ instrument_types: newTypes.length > 0 ? newTypes.join(',') : null, tab: activeTab });
                  }}
                  className="hover:bg-green-700 rounded text-white ml-1"
                  title={`Remove ${type} filter`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-600 pb-3">
        {[
          { key: 'summary', label: 'Summary & Statistics' },
          { key: 'search', label: 'Search & Filter' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as any);
              updateUrlParams({ tab: tab.key });
            }}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {loading && <div className="text-center py-4 text-blue-400">Loading...</div>}
          {error && (
            <div className="bg-red-900/30 border border-red-600 text-red-300 px-4 py-3 rounded text-center">
              ERROR: {error}
            </div>
          )}
          
          {/* Database Status */}
          {dbStatus && (
            <div className="bg-gray-800/50 p-4 rounded border border-gray-600">
              <h3 className="text-lg font-medium mb-3">
                Database Status 
                {dbStatus.filter_display && (
                  <span className="text-blue-400 text-sm ml-2">({dbStatus.filter_display})</span>
                )}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {(dbStatus.price_series_count || 0).toLocaleString()}
                  </div>
                  <div className="text-gray-400">Total Symbols</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {(dbStatus.validation_flags_count || 0).toLocaleString()}
                  </div>
                  <div className="text-gray-400">With Validation Data</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {(dbStatus.countries_available?.length || 0)}
                  </div>
                  <div className="text-gray-400">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Latest Update</div>
                  <div className="font-medium">
                    {dbStatus.latest_update 
                      ? new Date(dbStatus.latest_update).toLocaleDateString()
                      : 'N/A'
                    }
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Countries: {(dbStatus.countries_available || []).join(', ')}
              </div>
            </div>
          )}
          
          {/* Validation Summary */}
          {summary && summaryStats && (
            <div className="space-y-4">
              {/* Overall Statistics */}
              <div className="bg-gray-800/50 p-4 rounded border border-gray-600">
                <h3 className="text-lg font-medium mb-3">
                  Overall Validation Statistics
                  {(selectedCountry || selectedInstrumentTypes.length > 0) && (
                    <span className="text-blue-400 ml-2">
                      ({[selectedCountry, ...selectedInstrumentTypes].filter(Boolean).join(', ')})
                    </span>
                  )}
                  <span className="text-xs text-gray-400 ml-2">(click to filter)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div 
                    onClick={() => navigateToSearch({ valid: true })}
                    className="text-center p-4 rounded cursor-pointer hover:bg-green-900/20 transition-colors"
                    title="Click to view all valid symbols"
                  >
                    <div className="text-3xl font-bold text-green-400">
                      {(summary.valid_symbols || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Valid Symbols</div>
                    <div className="text-xs text-green-300">({summaryStats.validPercentage}%)</div>
                  </div>
                  <div 
                    onClick={() => navigateToSearch({ valid: false })}
                    className="text-center p-4 rounded cursor-pointer hover:bg-red-900/20 transition-colors"
                    title="Click to view all invalid symbols"
                  >
                    <div className="text-3xl font-bold text-red-400">
                      {(summary.invalid_symbols || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Invalid Symbols</div>
                    <div className="text-xs text-red-300">({summaryStats.invalidPercentage}%)</div>
                  </div>
                  <div 
                    onClick={() => navigateToSearch({})}
                    className="text-center p-4 rounded cursor-pointer hover:bg-blue-900/20 transition-colors"
                    title="Click to view all analyzed symbols"
                  >
                    <div className="text-3xl font-bold text-blue-400">
                      {(summary.total_validated || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Total Analyzed</div>
                    <div className="text-xs text-blue-300">({summaryStats?.validatedPercentage || 0}% of total)</div>
                  </div>
                </div>
              </div>
              
              {/* Category Breakdown */}
              <div className="bg-gray-800/50 p-4 rounded border border-gray-600">
                <h3 className="text-lg font-medium mb-3">Failure Categories <span className="text-xs text-gray-400">(click to filter)</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div 
                    onClick={() => navigateToSearch({ 
                      flags: ['insufficient_total_history', 'insufficient_data_after_cleanup'] 
                    })}
                    className="text-center p-3 bg-red-900/20 rounded border border-red-800 cursor-pointer hover:bg-red-900/30 transition-colors"
                    title="Click to view symbols with historical sufficiency issues"
                  >
                    <div className="text-xl font-bold text-red-400">
                      {(summary.historical_sufficiency_failures || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-red-300">Historical Sufficiency</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {summaryStats?.historicalFailuresPercentage || 0}% of total
                    </div>
                  </div>
                  <div 
                    onClick={() => navigateToSearch({ 
                      flags: ['backward_dates', 'zero_or_negative_prices', 'extreme_price_jumps', 'price_discontinuities'] 
                    })}
                    className="text-center p-3 bg-orange-900/20 rounded border border-orange-800 cursor-pointer hover:bg-orange-900/30 transition-colors"
                    title="Click to view symbols with structural integrity issues"
                  >
                    <div className="text-xl font-bold text-orange-400">
                      {(summary.structural_integrity_failures || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-orange-300">Structural Integrity</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {summaryStats?.structuralFailuresPercentage || 0}% of total
                    </div>
                  </div>
                  <div 
                    onClick={() => navigateToSearch({ 
                      flags: ['low_liquidity_warning', 'long_plateaus', 'illiquid_spikes'] 
                    })}
                    className="text-center p-3 bg-yellow-900/20 rounded border border-yellow-800 cursor-pointer hover:bg-yellow-900/30 transition-colors"
                    title="Click to view symbols with liquidity & activity warnings"
                  >
                    <div className="text-xl font-bold text-yellow-400">
                      {(summary.liquidity_activity_warnings || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-yellow-300">Liquidity & Activity</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {summaryStats?.liquidityWarningsPercentage || 0}% of total
                    </div>
                  </div>
                  <div 
                    onClick={() => navigateToSearch({ 
                      flags: ['critical_years', 'multiple_violations_last252', 'multiple_weak_years', 'robust_outliers'] 
                    })}
                    className="text-center p-3 bg-purple-900/20 rounded border border-purple-800 cursor-pointer hover:bg-purple-900/30 transition-colors"
                    title="Click to view symbols with statistical anomaly issues"
                  >
                    <div className="text-xl font-bold text-purple-400">
                      {(summary.statistical_anomaly_failures || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-purple-300">Statistical Anomaly</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {summaryStats?.statisticalFailuresPercentage || 0}% of total
                    </div>
                  </div>
                </div>
              </div>
              
                            {/* Detailed Flag Breakdown */}
              {FLAG_CATEGORIES && Object.keys(FLAG_CATEGORIES).length > 0 && (
                <div className="bg-gray-800/50 p-4 rounded border border-gray-600">
                  <h3 className="text-lg font-medium mb-3">Detailed Flag Analysis <span className="text-xs text-gray-400">(click flags to filter)</span></h3>
                  <div className="space-y-4">
                    {Object.entries(FLAG_CATEGORIES || {}).map(([category, flags]) => (
                      <div key={category} className="border border-gray-700 rounded p-3">
                        <h4 className="font-medium text-sm mb-2 text-gray-300">{category}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {(flags || []).map(flag => {
                          const count = summary.flag_counts?.[flag as keyof typeof summary.flag_counts] || 0;
                          const percentage = (summary.total_symbols || 0) > 0 
                            ? (count / (summary.total_symbols || 1) * 100).toFixed(1)
                            : '0.0';
                          return (
                            <div 
                              key={flag} 
                              onClick={() => count > 0 && navigateToSearch({ flags: [flag] })}
                              className={`flex justify-between items-start p-2 bg-gray-900/50 rounded transition-colors ${
                                count > 0 ? 'cursor-pointer hover:bg-gray-800/70' : 'opacity-50'
                              }`}
                              title={count > 0 ? `Click to view ${count} symbols with ${flag.replace(/_/g, ' ')}` : 'No symbols with this flag'}
                            >
                              <div className="flex-1">
                                <div className="font-medium text-white">{flag.replace(/_/g, ' ').toUpperCase()}</div>
                                <div className="text-gray-400 text-xs mt-1">
                                  {getFlagDescription(flag)}
                                </div>
                              </div>
                              <div className="text-right ml-3">
                                <div className={`font-bold ${count > 0 ? 'text-red-400' : 'text-gray-600'}`}>
                                  {count.toLocaleString()}
                                </div>
                                <div className="text-gray-500">({percentage}%)</div>
                              </div>
                            </div>
                          );
                        })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-center">
                <button
                  onClick={loadSummaryData}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded text-white disabled:opacity-60"
                >
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>
            </div>
          )}
          
          {/* What-if Analysis Block */}
          <div className="bg-gray-800/50 p-4 rounded border border-gray-600">
            <h3 className="text-lg font-medium mb-3">What-if Analysis: Years Threshold Impact</h3>
            <p className="text-sm text-gray-400 mb-4">
              Analyze how changing the minimum years of history requirement would affect validation results
            </p>
            
            {/* Years Input and Calculate Button */}
            <div className="mb-4 flex items-center gap-4">
              <label className="text-sm font-medium">
                New Years Threshold:
              </label>
              <input
                type="number"
                min="1"
                max="30"
                step="0.5"
                value={whatIfYears}
                onChange={(e) => setWhatIfYears(parseFloat(e.target.value) || 10)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white w-20"
              />
              <span className="text-sm text-gray-400">years (current: 10 years)</span>
              <button
                onClick={loadWhatIfAnalysis}
                disabled={whatIfLoading}
                className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded text-white text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {whatIfLoading ? 'Calculating...' : 'Recalculate'}
              </button>
            </div>
            
            {/* What-if Results */}
            {whatIfData && (
              <div className="space-y-4">
                {/* Update Notice */}
                {!whatIfLoading && (
                  <div className="text-xs text-amber-400 bg-amber-900/10 border border-amber-800/30 rounded p-2">
                    💡 Results shown are for <strong>{whatIfData.years_threshold}-year</strong> threshold
                    {(selectedCountry || selectedInstrumentTypes.length > 0) && (
                      <span> with current filters ({whatIfData.filter_applied.country}
                        {selectedInstrumentTypes.length > 0 && (
                          <span>, {whatIfData.filter_applied.instrument_types.join(', ')}</span>
                        )})
                      </span>
                    )}. 
                    Click <strong>Recalculate</strong> after changing filters or threshold.
                  </div>
                )}
                {/* Comparison Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-900/20 rounded border border-blue-800">
                    <div className="text-xl font-bold text-blue-400">
                      {whatIfData.current_stats.current_valid.toLocaleString()}
                    </div>
                    <div className="text-xs text-blue-300">Currently Valid</div>
                    <div className="text-xs text-gray-500">
                      ({whatIfData.current_stats.current_valid_percentage}%)
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-900/20 rounded border border-green-800">
                    <div className="text-xl font-bold text-green-400">
                      {whatIfData.would_be_valid.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-300">Would Be Valid</div>
                    <div className="text-xs text-gray-500">
                      ({whatIfData.would_be_valid_percentage}%)
                    </div>
                  </div>
                  <div 
                    className={`text-center p-3 rounded border cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                      whatIfData.improvement.direction === 'improvement' 
                        ? 'bg-green-900/20 border-green-800 hover:bg-green-900/30 hover:border-green-700' 
                        : whatIfData.improvement.direction === 'decline'
                        ? 'bg-red-900/20 border-red-800 hover:bg-red-900/30 hover:border-red-700'
                        : 'bg-gray-900/20 border-gray-800 hover:bg-gray-900/30 hover:border-gray-700'
                    }`}
                    onClick={handleNetChangeClick}
                    title={`Click to view ${Math.abs(whatIfData.improvement.additional_valid)} symbols that would change status`}
                  >
                    <div className={`text-xl font-bold ${
                      whatIfData.improvement.direction === 'improvement' 
                        ? 'text-green-400' 
                        : whatIfData.improvement.direction === 'decline'
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}>
                      {whatIfData.improvement.additional_valid > 0 ? '+' : ''}{whatIfData.improvement.additional_valid.toLocaleString()}
                    </div>
                    <div className={`text-xs ${
                      whatIfData.improvement.direction === 'improvement' 
                        ? 'text-green-300' 
                        : whatIfData.improvement.direction === 'decline'
                        ? 'text-red-300'
                        : 'text-gray-300'
                    }`}>
                      Net Change {whatIfData.improvement.additional_valid !== 0 && '(click to explore)'}
                    </div>
                    <div className="text-xs text-gray-500">
                      ({whatIfData.improvement.percentage_change > 0 ? '+' : ''}{whatIfData.improvement.percentage_change.toFixed(1)}%)
                    </div>
                  </div>
                </div>
                
                {/* Analysis Summary */}
                <div className="text-sm p-3 bg-gray-900/30 rounded">
                  <div className="font-medium text-white mb-2">Analysis Summary:</div>
                  <div className="text-gray-300">
                    With a <strong>{whatIfData.years_threshold}-year</strong> history requirement{' '}
                    {(selectedCountry || selectedInstrumentTypes.length > 0) && (
                      <span>for <strong>{whatIfData.filter_applied.country}</strong>
                        {selectedInstrumentTypes.length > 0 && (
                          <span> {whatIfData.filter_applied.instrument_types.join(', ')} instruments</span>
                        )}
                      </span>
                    )}:
                  </div>
                  <ul className="mt-2 text-gray-400 text-xs space-y-1 ml-4">
                    <li>• {whatIfData.would_be_valid.toLocaleString()} out of {whatIfData.total_analyzed.toLocaleString()} analyzed symbols would be valid</li>
                    {whatIfData.improvement.direction === 'improvement' && (
                      <li>• <span className="text-green-400">{whatIfData.improvement.additional_valid} additional symbols</span> would become valid</li>
                    )}
                    {whatIfData.improvement.direction === 'decline' && (
                      <li>• <span className="text-red-400">{Math.abs(whatIfData.improvement.additional_valid)} fewer symbols</span> would be valid</li>
                    )}
                    {whatIfData.improvement.direction === 'no_change' && (
                      <li>• No change in validation results</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
            
            {!whatIfData && !whatIfLoading && (
              <div className="text-center py-8 text-gray-400">
                <div className="mb-2">🔮</div>
                <div className="text-sm">
                  Click <strong>Recalculate</strong> to analyze the impact of changing the years threshold
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Analysis considers current filters and validation criteria
                </div>
              </div>
            )}
            
            {whatIfLoading && !whatIfData && (
              <div className="text-center py-8 text-gray-400">
                <div className="mb-2">⏳</div>
                <div className="text-sm">Analyzing validation impact...</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-600 text-red-300 px-4 py-3 rounded text-center">
              ERROR: {error}
            </div>
          )}
          {/* Search Filters */}
          <div className="bg-gray-800/50 p-4 rounded border border-gray-600">
            <h3 className="text-lg font-medium mb-3">Search Filters</h3>
            <div className="space-y-6">
              {/* Basic Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Symbol Search */}
                <div>
                  <label className="block text-sm font-medium mb-1">Symbol</label>
                  <input
                    type="text"
                    placeholder="e.g. AAPL, MSFT"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
                    value={internalSearchParams.symbol_search || ''}
                    onChange={e => updateSearchParam('symbol_search', e.target.value || undefined)}
                  />
                </div>
                
                {/* Country Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    value={internalSearchParams.country || ''}
                    onChange={e => updateSearchParam('country', e.target.value || undefined)}
                  >
                    <option value="">All Countries</option>
                    {(dbStatus?.countries_available || []).map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                
                {/* Validity Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Validity</label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    value={internalSearchParams.valid === null || internalSearchParams.valid === undefined ? '' : internalSearchParams.valid ? 'true' : 'false'}
                    onChange={e => {
                      const value = e.target.value;
                      updateSearchParam('valid', value === '' ? null : value === 'true');
                    }}
                  >
                    <option value="">All Symbols</option>
                    <option value="true">Valid Only</option>
                    <option value="false">Invalid Only</option>
                  </select>
                </div>
                
                {/* Warnings Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Warnings</label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    value={internalSearchParams.has_warnings === null || internalSearchParams.has_warnings === undefined ? '' : internalSearchParams.has_warnings ? 'true' : 'false'}
                    onChange={e => {
                      const value = e.target.value;
                      updateSearchParam('has_warnings', value === '' ? null : value === 'true');
                    }}
                  >
                    <option value="">All</option>
                    <option value="true">With Warnings</option>
                    <option value="false">No Warnings</option>
                  </select>
                </div>
              </div>

              {/* Specific Validation Flags */}
              <div className="border-t border-gray-600 pt-4">
                <h4 className="text-sm font-medium mb-3 text-gray-300">Filter by Specific Issues</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(FLAG_CATEGORIES || {}).map(([category, flags]) => (
                    <div key={category} className="border border-gray-700 rounded p-3">
                      <h5 className="font-medium text-xs mb-2 text-gray-300">{category}</h5>
                      <div className="space-y-2">
                        {(flags || []).map(flag => (
                          <label key={flag} className="flex items-center text-xs">
                            <input
                              type="checkbox"
                              checked={(internalSearchParams.flags || []).includes(flag)}
                              onChange={e => {
                                const currentFlags = internalSearchParams.flags || [];
                                const newFlags = e.target.checked 
                                  ? [...currentFlags, flag]
                                  : currentFlags.filter(f => f !== flag);
                                updateSearchParam('flags', newFlags.length > 0 ? newFlags : undefined);
                              }}
                              className="mr-2 text-xs"
                            />
                            <span className="text-gray-400">
                              {flag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Clear Flags Button */}
                {(internalSearchParams.flags || []).length > 0 && (
                  <div className="mt-3 text-center">
                    <button
                      onClick={() => updateSearchParam('flags', undefined)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm text-white"
                    >
                      Clear All Flags ({(internalSearchParams.flags || []).length} selected)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Search Results */}
          {loading && <div className="text-center py-8">Searching...</div>}
          
          {searchResults && (
            <div className="bg-gray-800/50 p-4 rounded border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Search Results ({(searchResults.total || 0).toLocaleString()} total)
                </h3>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-400">
                    Showing {(searchResults.offset || 0) + 1}-{Math.min((searchResults.offset || 0) + (searchResults.limit || 0), (searchResults.total || 0))} of {searchResults.total || 0}
                  </div>
                </div>
              </div>
              
              {/* Enhanced Pagination */}
              {(searchResults.total || 0) > 0 && (
                <div className="space-y-4 mb-4">
                  {/* Page Size and Info Row */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-400">Page size:</label>
                      <select
                        value={internalSearchParams.limit || 50}
                        onChange={e => {
                          updateSearchParam('limit', parseInt(e.target.value));
                          updateSearchParam('offset', 0); // Reset to first page
                        }}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                      </select>
                    </div>
                    <div className="text-sm text-gray-400">
                      Total: {(searchResults.total || 0).toLocaleString()} records
                    </div>
                  </div>
                  
                  {/* Navigation Controls */}
                  {(searchResults.total || 0) > (searchResults.limit || 50) && (
                    <div className="flex justify-center items-center gap-2">
                      {/* First Page */}
                      <button
                        onClick={() => updateSearchParam('offset', 0)}
                        disabled={(searchResults.offset || 0) === 0}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="First page"
                      >
                        ⇤
                      </button>
                      
                      {/* Previous Page */}
                      <button
                        onClick={() => updateSearchParam('offset', Math.max(0, (internalSearchParams.offset || 0) - (searchResults.limit || 50)))}
                        disabled={(searchResults.offset || 0) === 0}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Previous page"
                      >
                        ← Previous
                      </button>
                      
                      {/* Current Page Info with Direct Input */}
                      <div className="flex items-center gap-2 mx-4">
                        <span className="text-sm text-gray-400">Page</span>
                        <input
                          type="number"
                          min="1"
                          max={Math.ceil((searchResults.total || 0) / (searchResults.limit || 50))}
                          value={Math.floor((searchResults.offset || 0) / (searchResults.limit || 50)) + 1}
                          onChange={e => {
                            const page = parseInt(e.target.value) || 1;
                            const maxPage = Math.ceil((searchResults.total || 0) / (searchResults.limit || 50));
                            const validPage = Math.max(1, Math.min(page, maxPage));
                            const newOffset = (validPage - 1) * (searchResults.limit || 50);
                            updateSearchParam('offset', newOffset);
                          }}
                          className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-center text-sm text-white"
                        />
                        <span className="text-sm text-gray-400">
                          of {Math.ceil((searchResults.total || 0) / (searchResults.limit || 50))}
                        </span>
                      </div>
                      
                      {/* Next Page */}
                      <button
                        onClick={() => updateSearchParam('offset', (searchResults.offset || 0) + (searchResults.limit || 50))}
                        disabled={(searchResults.offset || 0) + (searchResults.limit || 50) >= (searchResults.total || 0)}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Next page"
                      >
                        Next →
                      </button>
                      
                      {/* Last Page */}
                      <button
                        onClick={() => {
                          const lastPageOffset = Math.floor(((searchResults.total || 0) - 1) / (searchResults.limit || 50)) * (searchResults.limit || 50);
                          updateSearchParam('offset', lastPageOffset);
                        }}
                        disabled={(searchResults.offset || 0) + (searchResults.limit || 50) >= (searchResults.total || 0)}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Last page"
                      >
                        ⇥
                      </button>
                    </div>
                  )}
                  
                  {/* Results Range Info */}
                  <div className="text-center text-sm text-gray-400">
                    Showing {(searchResults.offset || 0) + 1}-{Math.min((searchResults.offset || 0) + (searchResults.limit || 50), (searchResults.total || 0))} 
                    of {(searchResults.total || 0).toLocaleString()} results
                  </div>
                </div>
              )}
              
              {/* Results Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th 
                        className="text-left py-2 px-2 cursor-pointer hover:bg-gray-700/30 select-none"
                        onClick={() => handleSort('symbol')}
                        title="Click to sort by Symbol"
                      >
                        <div className="flex items-center gap-1">
                          Symbol
                          {internalSearchParams.sort_by === 'symbol' && (
                            <span className="text-blue-400">
                              {internalSearchParams.sort_order === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-left py-2 px-2 cursor-pointer hover:bg-gray-700/30 select-none"
                        onClick={() => handleSort('country')}
                        title="Click to sort by Country"
                      >
                        <div className="flex items-center gap-1">
                          Country
                          {internalSearchParams.sort_by === 'country' && (
                            <span className="text-blue-400">
                              {internalSearchParams.sort_order === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-center py-2 px-2 cursor-pointer hover:bg-gray-700/30 select-none"
                        onClick={() => handleSort('valid')}
                        title="Click to sort by Validity"
                      >
                        <div className="flex items-center justify-center gap-1">
                          Valid
                          {internalSearchParams.sort_by === 'valid' && (
                            <span className="text-blue-400">
                              {internalSearchParams.sort_order === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-center py-2 px-2 cursor-pointer hover:bg-gray-700/30 select-none"
                        onClick={() => handleSort('years_actual')}
                        title="Click to sort by Years of History"
                      >
                        <div className="flex items-center justify-center gap-1">
                          Years
                          {internalSearchParams.sort_by === 'years_actual' && (
                            <span className="text-blue-400">
                              {internalSearchParams.sort_order === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="text-left py-2 px-2">Issues</th>
                      <th className="text-left py-2 px-2">Warnings</th>
                      <th 
                        className="text-left py-2 px-2 cursor-pointer hover:bg-gray-700/30 select-none"
                        onClick={() => handleSort('updated_at')}
                        title="Click to sort by Update Date"
                      >
                        <div className="flex items-center gap-1">
                          Updated
                          {internalSearchParams.sort_by === 'updated_at' && (
                            <span className="text-blue-400">
                              {internalSearchParams.sort_order === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="text-center py-2 px-2 w-24">Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(searchResults.items || []).map((item, idx) => (
                      <tr key={item.id} className={`border-b border-gray-700 ${idx % 2 === 0 ? 'bg-gray-900/30' : ''}`}>
                        <td className="py-2 px-2 font-mono text-blue-400">{item.symbol}</td>
                        <td className="py-2 px-2">{item.country}</td>
                        <td className="py-2 px-2 text-center">
                          <span className={`inline-block w-3 h-3 rounded-full ${item.valid ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </td>
                        <td className="py-2 px-2 text-center font-mono">
                          {item.years_actual !== null ? item.years_actual.toFixed(2) : '—'}
                        </td>
                        <td className="py-2 px-2">
                          <div className="space-y-1">
                            {(item.rejection_reasons || []).map(reason => (
                              <div 
                                key={reason} 
                                className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded cursor-help"
                                title={getFlagDescription(reason)}
                              >
                                {reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-2 px-2">
                          <div className="space-y-1">
                            {(item.warnings || []).map(warning => (
                              <div 
                                key={warning} 
                                className="text-xs bg-yellow-900/30 text-yellow-300 px-2 py-1 rounded cursor-help"
                                title={getFlagDescription(warning)}
                              >
                                {warning.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-2 px-2 text-gray-400">
                          {item.as_of_date ? new Date(item.as_of_date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <div className="relative inline-block group">
                            {/* Animated button that grows on hover */}
                            <button
                              onClick={() => downloadSingleTimeSeries(item.symbol, item.country)}
                              className="bg-green-600 hover:bg-green-700 rounded text-white font-medium transition-all duration-300 ease-in-out flex items-center justify-center z-10 relative overflow-hidden group-hover:px-3 px-0"
                              style={{
                                width: 'auto',
                                minWidth: '2rem',
                                height: '2rem'
                              }}
                              title="Download TimeSeries"
                            >
                              {/* Icon - always visible */}
                              <span className="transition-all duration-300 group-hover:mr-2 mr-0">
                                ⬇
                              </span>
                              
                              {/* Text - appears on hover */}
                              <span className="transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-xs text-xs">
                                Download TimeSeries from EODHD
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}


    </div>
  );
}
