import { FaultData } from '../types/fault';

// 環境に応じてベースURLを切り替える
const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    // 本番環境では環境変数から取得
    return import.meta.env.VITE_STORAGE_BASE_URL || '';
  }
  // 開発環境ではローカルパスを使用
  return '/data/knowledge';
};

export const fetchFaultData = async (faultId: string): Promise<FaultData> => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/fault_${faultId}.json`);
    
    if (!response.ok) {
      throw new Error(`故障データの取得に失敗しました: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('故障データの取得中にエラーが発生しました:', error);
    throw error;
  }
};

export const fetchAllFaultData = async (): Promise<FaultData[]> => {
  try {
    const response = await fetch('/api/fault-data');
    if (!response.ok) {
      throw new Error('故障データの取得に失敗しました');
    }
    return await response.json();
  } catch (error) {
    console.error('故障データの取得エラー:', error);
    throw error;
  }
}; 