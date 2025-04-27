import json
import os
from datetime import datetime
from typing import Dict, List, Optional

class FaultDataLoader:
    def __init__(self, data_dir: str = "attached_assets"):
        self.data_dir = data_dir

    def load_fault_data(self, file_path: str) -> Dict:
        """故障情報のJSONファイルを読み込む"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading fault data: {e}")
            return {}

    def get_fault_history(self, file_path: str) -> List[Dict]:
        """故障履歴を取得"""
        data = self.load_fault_data(file_path)
        return data.get('conversation_history', [])

    def get_diagnostics(self, file_path: str) -> Dict:
        """診断情報を取得"""
        data = self.load_fault_data(file_path)
        return data.get('diagnostics', {})

    def get_device_context(self, file_path: str) -> Dict:
        """デバイスコンテキストを取得"""
        data = self.load_fault_data(file_path)
        return data.get('device_context', {})

    def get_latest_fault_data(self) -> Optional[Dict]:
        """最新の故障情報を取得"""
        try:
            files = [f for f in os.listdir(self.data_dir) if f.endswith('.json')]
            if not files:
                return None
            
            latest_file = max(files, key=lambda x: os.path.getctime(os.path.join(self.data_dir, x)))
            return self.load_fault_data(os.path.join(self.data_dir, latest_file))
        except Exception as e:
            print(f"Error getting latest fault data: {e}")
            return None 