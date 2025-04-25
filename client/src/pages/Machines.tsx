import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = '/api';

interface Machine {
  id: string;
  name: string;
  type: string;
  status: string;
  lastMaintenance: string;
}

export default function Machines() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/machines`);
      setMachines(response.data.machines);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching machines:', error);
      setError('機械データの取得に失敗しました');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">機械管理</h1>
        <Link
          to="/machines/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          新規登録
        </Link>
      </div>

      {machines.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">登録された機械はありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {machines.map((machine) => (
            <div
              key={machine.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{machine.name}</h3>
                  <p className="text-sm text-gray-500">
                    最終メンテナンス: {new Date(machine.lastMaintenance).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    machine.status === '正常' 
                      ? 'bg-green-100 text-green-800'
                      : machine.status === '注意'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {machine.status}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                    {machine.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 