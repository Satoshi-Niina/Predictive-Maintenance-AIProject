import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { format, subDays } from 'date-fns';

interface FaultRecord {
  id: string;
  machineId: string;
  machineType: string;
  faultType: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'in_progress' | 'resolved';
  timestamp: string;
  affectedComponents: string[];
}

const FaultInfo: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [faultRecords, setFaultRecords] = useState<FaultRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FaultRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFault, setSelectedFault] = useState<FaultRecord | null>(null);

  useEffect(() => {
    fetchFaultRecords();
  }, []);

  const fetchFaultRecords = async () => {
    try {
      // TODO: Replace with actual API call
      const mockData: FaultRecord[] = [
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
      setFaultRecords(mockData);
      setFilteredRecords(mockData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    
    const filtered = faultRecords.filter(record => 
      record.machineId.toLowerCase().includes(searchValue) ||
      record.machineType.toLowerCase().includes(searchValue) ||
      record.faultType.toLowerCase().includes(searchValue) ||
      record.description.toLowerCase().includes(searchValue)
    );
    
    setFilteredRecords(filtered);
  };

  const handlePrint = () => {
    window.print();
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800 mx-auto"></div>
        <p className="mt-2 text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">エラーが発生しました: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">機械故障情報</h2>
        <Button onClick={handlePrint} variant="outline">
          印刷
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="機械ID、機種、故障タイプで検索..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-md"
        />
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
          {filteredRecords.map((record) => (
            <TableRow key={record.id} className="border-b border-blue-200">
              <TableCell className="border-r border-blue-200">{format(new Date(record.timestamp), 'yyyy/MM/dd HH:mm')}</TableCell>
              <TableCell className="border-r border-blue-200">{record.machineId}</TableCell>
              <TableCell className="border-r border-blue-200">{record.machineType}</TableCell>
              <TableCell className="border-r border-blue-200">{record.faultType}</TableCell>
              <TableCell className="border-r border-blue-200">{record.description}</TableCell>
              <TableCell className="border-r border-blue-200">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(record.severity)}`}>
                  {record.severity === 'high' ? '高' : record.severity === 'medium' ? '中' : '低'}
                </span>
              </TableCell>
              <TableCell className="border-r border-blue-200">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                  {record.status === 'new' ? '新規' : 
                   record.status === 'in_progress' ? '対応中' : '解決済'}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFault(record)}
                >
                  詳細
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedFault && (
        <Card className="p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">故障詳細</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">機械情報</h4>
              <p className="mt-1">ID: {selectedFault.machineId}</p>
              <p>機種: {selectedFault.machineType}</p>
            </div>
            <div>
              <h4 className="font-medium">故障情報</h4>
              <p className="mt-1">タイプ: {selectedFault.faultType}</p>
              <p>説明: {selectedFault.description}</p>
            </div>
            <div>
              <h4 className="font-medium">影響を受けるコンポーネント</h4>
              <ul className="list-disc list-inside mt-1">
                {selectedFault.affectedComponents.map((component, index) => (
                  <li key={index}>{component}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium">ステータス情報</h4>
              <p className="mt-1">重要度: {
                selectedFault.severity === 'high' ? '高' :
                selectedFault.severity === 'medium' ? '中' : '低'
              }</p>
              <p>状態: {
                selectedFault.status === 'new' ? '新規' :
                selectedFault.status === 'in_progress' ? '対応中' : '解決済'
              }</p>
              <p>発生日時: {format(new Date(selectedFault.timestamp), 'yyyy/MM/dd HH:mm')}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FaultInfo; 