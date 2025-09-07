import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Download, RefreshCw, CheckCircle, XCircle, AlertTriangle, Filter, Database, FileText } from 'lucide-react';

interface SymbolData {
  symbol: string;
  name: string;
  country: string;
  exchange: string;
  currency: string;
  instrument_type: string;
  isin: string;
  status?: 'match' | 'missing_in_db' | 'missing_in_csv';
  insufficient_history?: number | null;
  five_stars?: number;
}

interface ComparisonData {
  summary: {
    total_csv: number;
    total_db: number;
    matches: number;
    csv_only: number;
    db_only: number;
    match_percentage: number;
  };
  csv_data: SymbolData[];
  db_data: SymbolData[];
  missing_symbols: SymbolData[];
}

interface Country {
  code: string;
  name: string;
  count: number;
}

interface InstrumentType {
  type: string;
  name: string;
  count: number;
}

const TickerCheckPage: React.FC = () => {
  // State management
  const [countries, setCountries] = useState<Country[]>([]);
  const [instrumentTypes, setInstrumentTypes] = useState<InstrumentType[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [dbSymbols, setDbSymbols] = useState<SymbolData[]>([]);
  const [showOnlyDifferences, setShowOnlyDifferences] = useState<boolean>(false);
  const [selectedMissingSymbols, setSelectedMissingSymbols] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    loadCountries();
    loadInstrumentTypes();
  }, []);

  // Load database symbols when filters change
  useEffect(() => {
    if (selectedCountry || selectedTypes.length > 0) {
      loadDbSymbols();
    }
  }, [selectedCountry, selectedTypes]);

  const loadCountries = async () => {
    try {
      const response = await fetch('/api/ticker/check/countries');
      const data = await response.json();
      setCountries(data.countries);
    } catch (error) {
      console.error('Failed to load countries:', error);
    }
  };

  const loadInstrumentTypes = async () => {
    try {
      const response = await fetch('/api/ticker/check/instrument-types');
      const data = await response.json();
      setInstrumentTypes(data.instrument_types);
    } catch (error) {
      console.error('Failed to load instrument types:', error);
    }
  };

  const loadDbSymbols = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCountry) params.append('country', selectedCountry);
      if (selectedTypes.length > 0) params.append('instrument_types', selectedTypes.join(','));

      const response = await fetch(`/api/ticker/check/symbols?${params}`);
      const data = await response.json();
      setDbSymbols(data.symbols);
    } catch (error) {
      console.error('Failed to load database symbols:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const handleParseAndCompare = async () => {
    if (!csvFile) {
      alert('Please select a CSV file first');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      if (selectedCountry) formData.append('country', selectedCountry);
      if (selectedTypes.length > 0) formData.append('instrument_types', selectedTypes.join(','));

      const response = await fetch('/api/ticker/check/parse-csv', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data: ComparisonData = await response.json();
      setComparisonData(data);
      setSelectedMissingSymbols(new Set());
    } catch (error) {
      console.error('Failed to parse CSV:', error);
      alert(`Failed to parse CSV: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleMissingSymbolToggle = (symbol: string) => {
    setSelectedMissingSymbols(prev => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  };

  const handleSelectAllMissing = () => {
    if (!comparisonData) return;
    
    const missingSymbols = comparisonData.missing_symbols.map(s => s.symbol);
    setSelectedMissingSymbols(new Set(missingSymbols));
  };

  const handleDeselectAll = () => {
    setSelectedMissingSymbols(new Set());
  };

  const handleSync = async () => {
    if (!comparisonData || selectedMissingSymbols.size === 0) {
      alert('No symbols selected for sync');
      return;
    }

    setSyncing(true);
    try {
      const symbolsToSync = comparisonData.missing_symbols.filter(s => 
        selectedMissingSymbols.has(s.symbol)
      );

      const response = await fetch('/api/ticker/check/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(symbolsToSync)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const result = await response.json();
      alert(`Successfully synced ${result.synced_count} symbols to database`);
      
      // Refresh database symbols and comparison
      await loadDbSymbols();
      if (csvFile) {
        await handleParseAndCompare();
      }
      
      setSelectedMissingSymbols(new Set());
    } catch (error) {
      console.error('Failed to sync symbols:', error);
      alert(`Failed to sync symbols: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setSyncing(false);
    }
  };

  const getFilteredCsvData = () => {
    if (!comparisonData) return [];
    
    if (showOnlyDifferences) {
      return comparisonData.csv_data.filter(s => s.status === 'missing_in_db');
    }
    return comparisonData.csv_data;
  };

  const getFilteredDbData = () => {
    if (!comparisonData) return dbSymbols;
    
    if (showOnlyDifferences) {
      return comparisonData.db_data.filter(s => s.status === 'missing_in_csv');
    }
    return comparisonData.db_data;
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'match':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'missing_in_db':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'missing_in_csv':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Ticker Check</h1>
          <p className="text-gray-300">Compare and synchronize tickers from CSV with database</p>
        </div>

        {/* Controls Panel */}
        <div className="glass p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
              />
              {csvFile && (
                <p className="text-sm text-green-400 mt-1">✓ {csvFile.name}</p>
              )}
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Country Filter
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="block w-full px-3 py-2 bg-[#2d2d2d] border border-gray-600 rounded text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Instrument Types */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <Database className="w-4 h-4 inline mr-2" />
                Instrument Types
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-600 rounded-md p-2 bg-[#2d2d2d]">
                {instrumentTypes.map(type => (
                  <label key={type.type} className="flex items-center text-sm text-white">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.type)}
                      onChange={() => handleTypeToggle(type.type)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded"
                    />
                    {type.name} ({type.count})
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleParseAndCompare}
              disabled={!csvFile || loading}
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCw className="animate-spin w-5 h-5 mr-2" />
              ) : (
                <Upload className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Processing...' : 'Parse & Compare'}
            </button>
          </div>
        </div>

        {/* Summary */}
        {comparisonData && (
          <div className="glass p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Comparison Summary</h2>
              <label className="flex items-center text-sm text-white">
                <input
                  type="checkbox"
                  checked={showOnlyDifferences}
                  onChange={(e) => setShowOnlyDifferences(e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded"
                />
                Show only differences
              </label>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{comparisonData.summary.total_csv}</div>
                <div className="text-sm text-gray-300">CSV Symbols</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{comparisonData.summary.total_db}</div>
                <div className="text-sm text-gray-300">DB Symbols</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{comparisonData.summary.matches}</div>
                <div className="text-sm text-gray-300">Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{comparisonData.summary.csv_only}</div>
                <div className="text-sm text-gray-300">Missing in DB</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-300">{comparisonData.summary.match_percentage}%</div>
                <div className="text-sm text-gray-300">Match Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Data Comparison */}
        {(comparisonData || dbSymbols.length > 0) && (
          <div className="glass overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-96">
              {/* CSV Data Column */}
              <div className="border-r border-gray-600">
                <div className="bg-[#2d2d2d] px-4 py-3 border-b border-gray-600">
                  <h3 className="text-lg font-medium text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    CSV Data ({getFilteredCsvData().length})
                  </h3>
                </div>
                <div className="overflow-auto h-80">
                  <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-[#2d2d2d] sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Symbol</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        {comparisonData && comparisonData.summary.csv_only > 0 && (
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sync</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {getFilteredCsvData().map((symbol, index) => (
                        <tr key={index} className="hover:bg-gray-800">
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-white">{symbol.symbol}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300 max-w-xs truncate" title={symbol.name}>{symbol.name}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">{symbol.instrument_type}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                            {getStatusIcon(symbol.status)}
                          </td>
                          {comparisonData && comparisonData.summary.csv_only > 0 && symbol.status === 'missing_in_db' && (
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                              <input
                                type="checkbox"
                                checked={selectedMissingSymbols.has(symbol.symbol)}
                                onChange={() => handleMissingSymbolToggle(symbol.symbol)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded"
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Database Data Column */}
              <div>
                <div className="bg-[#2d2d2d] px-4 py-3 border-b border-gray-600">
                  <h3 className="text-lg font-medium text-white flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Database Data ({getFilteredDbData().length})
                  </h3>
                </div>
                <div className="overflow-auto h-80">
                  <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-[#2d2d2d] sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Symbol</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {getFilteredDbData().map((symbol, index) => (
                        <tr key={index} className="hover:bg-gray-800">
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-white">{symbol.symbol}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300 max-w-xs truncate" title={symbol.name}>{symbol.name || '-'}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">{symbol.instrument_type || '-'}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                            {getStatusIcon(symbol.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sync Controls */}
        {comparisonData && comparisonData.summary.csv_only > 0 && (
          <div className="glass p-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">Synchronization</h3>
                <p className="text-sm text-gray-300">
                  {selectedMissingSymbols.size} of {comparisonData.summary.csv_only} missing symbols selected
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSelectAllMissing}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-gray-500 rounded hover:bg-gray-500"
                >
                  Select All
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-gray-500 rounded hover:bg-gray-500"
                >
                  Deselect All
                </button>
                <button
                  onClick={handleSync}
                  disabled={selectedMissingSymbols.size === 0 || syncing}
                  className="inline-flex items-center px-6 py-2 text-sm font-medium rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {syncing ? (
                    <RefreshCw className="animate-spin w-4 h-4 mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {syncing ? 'Syncing...' : `Sync ${selectedMissingSymbols.size} Symbols`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TickerCheckPage;
