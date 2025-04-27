import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';

interface FaultSearchProps {
  onSelectFault: (fault: any) => void;
}

const FaultSearch: React.FC<FaultSearchProps> = ({ onSelectFault }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockResults = [
        {
          id: '1',
          machineId: 'M001',
          machineType: 'CNC',
          faultType: '軸の異常',
          description: 'X軸の動作が不安定',
          severity: 'high',
          status: 'new',
          timestamp: '2024-03-20T10:30:00',
          affectedComponents: ['X軸', '制御システム']
        },
        {
          id: '2',
          machineId: 'M002',
          machineType: 'ロボット',
          faultType: 'センサー異常',
          description: '位置センサーの誤差が大きい',
          severity: 'medium',
          status: 'in_progress',
          timestamp: '2024-03-19T15:45:00',
          affectedComponents: ['位置センサー', '制御システム']
        }
      ];
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="機種、機器名、故障状況で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? '検索中...' : '検索'}
        </Button>
      </div>

      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="border-b border-blue-200">
            <TableHead className="border-r border-blue-200">日時</TableHead>
            <TableHead className="border-r border-blue-200">機械ID</TableHead>
            <TableHead className="border-r border-blue-200">機種</TableHead>
            <TableHead className="border-r border-blue-200">故障タイプ</TableHead>
            <TableHead className="border-r border-blue-200">説明</TableHead>
            <TableHead className="border-r border-blue-200">重要度</TableHead>
            <TableHead className="border-r border-blue-200">ステータス</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searchResults.map((result) => (
            <TableRow key={result.id} className="border-b border-blue-200">
              <TableCell className="border-r border-blue-200">{format(new Date(result.timestamp), 'yyyy/MM/dd HH:mm')}</TableCell>
              <TableCell className="border-r border-blue-200">{result.machineId}</TableCell>
              <TableCell className="border-r border-blue-200">{result.machineType}</TableCell>
              <TableCell className="border-r border-blue-200">{result.faultType}</TableCell>
              <TableCell className="border-r border-blue-200">{result.description}</TableCell>
              <TableCell className="border-r border-blue-200">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(result.severity)}`}>
                  {result.severity === 'high' ? '高' : result.severity === 'medium' ? '中' : '低'}
                </span>
              </TableCell>
              <TableCell className="border-r border-blue-200">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                  {result.status === 'new' ? '新規' : 
                   result.status === 'in_progress' ? '対応中' : '解決済'}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectFault(result)}
                >
                  選択
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FaultSearch; 