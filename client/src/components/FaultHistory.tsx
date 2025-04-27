import React, { useEffect, useState } from 'react';
import { historyService, HistoryData, HistoryStats } from '../services/historyService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const FaultHistory: React.FC = () => {
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [history, historyStats] = await Promise.all([
          historyService.getFaultHistory(),
          historyService.getHistoryStats()
        ]);
        setHistoryData(history);
        setStats(historyStats);
      } catch (err) {
        setError('履歴データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!stats) {
    return <div className="text-gray-500 p-4">履歴データが見つかりません</div>;
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">総故障数</h3>
          <p className="text-2xl font-bold">{stats.totalFaults}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">解決済み</h3>
          <p className="text-2xl font-bold text-green-600">{stats.resolvedFaults}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">調査中</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.investigatingFaults}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">未解決</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingFaults}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">故障タイプ分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.faultTypes}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stats.faultTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">重要度分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.severityDistribution}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stats.severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">最近の故障履歴</h3>
        <div className="space-y-2">
          {historyData.map((item, index) => (
            <div key={index} className="border-b pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.faultType}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${getStatusColor(item.status)}`}>
                    {item.status === 'resolved' ? '解決済み' :
                     item.status === 'pending' ? '未解決' : '調査中'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaultHistory; 