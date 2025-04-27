import React, { useEffect, useState } from 'react';
import { faultService, FaultData } from '../services/faultService';

const FaultInfo: React.FC = () => {
  const [faultData, setFaultData] = useState<FaultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await faultService.getFaultData();
        setFaultData(data);
      } catch (err) {
        setError('故障情報の取得に失敗しました');
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

  if (!faultData) {
    return <div className="text-gray-500 p-4">故障情報が見つかりません</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">故障情報</h2>
        <div className="space-y-2">
          <p><span className="font-semibold">セッションID:</span> {faultData.session_id}</p>
          <p><span className="font-semibold">タイムスタンプ:</span> {new Date(faultData.timestamp).toLocaleString()}</p>
          <p><span className="font-semibold">ユーザーID:</span> {faultData.user_id}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">デバイス情報</h2>
        <div className="space-y-2">
          <p><span className="font-semibold">環境:</span> {faultData.device_context.environment}</p>
          <p><span className="font-semibold">最終エクスポート:</span> {new Date(faultData.device_context.last_export).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">診断情報</h2>
        <div className="space-y-2">
          <p><span className="font-semibold">主要問題:</span> {faultData.diagnostics.primary_problem}</p>
          <p><span className="font-semibold">問題の説明:</span> {faultData.diagnostics.problem_description}</p>
          <div>
            <span className="font-semibold">コンポーネント:</span>
            <ul className="list-disc list-inside ml-4">
              {faultData.diagnostics.components.map((component, index) => (
                <li key={index}>{component}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">会話履歴</h2>
        <div className="space-y-4">
          {faultData.conversation_history.map((message) => (
            <div key={message.id} className="border-b pb-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{message.role}</span>
                <span>{new Date(message.timestamp).toLocaleString()}</span>
              </div>
              <p className="mt-1">{message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaultInfo; 