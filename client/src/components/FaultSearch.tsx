import React, { useEffect, useState } from 'react';
import { searchService, SearchResult, SearchFilters } from '../services/searchService';

const FaultSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<SearchResult[]>([]);
  const [faultTypes, setFaultTypes] = useState<string[]>([]);
  const [components, setComponents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [types, comps] = await Promise.all([
          searchService.getFaultTypes(),
          searchService.getComponents()
        ]);
        setFaultTypes(types);
        setComponents(comps);
      } catch (err) {
        setError('初期データの取得に失敗しました');
      }
    };

    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchResults = await searchService.searchFaults(searchQuery, filters);
      setResults(searchResults);
    } catch (err) {
      setError('検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'investigating':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">故障情報検索</h2>
        
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="検索キーワードを入力"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                故障タイプ
              </label>
              <select
                value={filters.faultType || ''}
                onChange={(e) => handleFilterChange('faultType', e.target.value || undefined)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">すべて</option>
                {faultTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                重要度
              </label>
              <select
                value={filters.severity || ''}
                onChange={(e) => handleFilterChange('severity', e.target.value || undefined)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">すべて</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ステータス
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">すべて</option>
                <option value="resolved">解決済み</option>
                <option value="pending">未解決</option>
                <option value="investigating">調査中</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              コンポーネント
            </label>
            <select
              multiple
              value={filters.components || []}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                handleFilterChange('components', values);
              }}
              className="w-full p-2 border rounded-md"
            >
              {components.map((component) => (
                <option key={component} value={component}>{component}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? '検索中...' : '検索'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 p-4">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">検索結果</h3>
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{result.faultType}</h4>
                  <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                  <div className="mt-2">
                    <span className="text-sm font-medium">コンポーネント: </span>
                    <span className="text-sm text-gray-600">
                      {result.components.join(', ')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${getStatusColor(result.status)}`}>
                    {result.status === 'resolved' ? '解決済み' :
                     result.status === 'pending' ? '未解決' : '調査中'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              {result.solution && (
                <div className="mt-2">
                  <p className="text-sm font-medium">解決策:</p>
                  <p className="text-sm text-gray-600">{result.solution}</p>
                </div>
              )}
            </div>
          ))}
          {results.length === 0 && !loading && (
            <p className="text-gray-500 text-center">検索結果がありません</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaultSearch; 