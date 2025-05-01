import json
import random
from datetime import datetime, timedelta
import os

def generate_dummy_inspection_data(num_records: int = 10) -> list:
    """キントーンからの点検記録のダミーデータを生成"""
    
    # 機械IDのリスト
    machine_ids = [f"M{i:03d}" for i in range(1, 21)]
    
    # 点検タイプのリスト
    inspection_types = [
        "定期点検",
        "緊急点検",
        "予防保全",
        "故障対応",
        "定期メンテナンス"
    ]
    
    # 異常パターンのリスト
    failure_patterns = [
        {
            "type": "振動異常",
            "findings": "モーターの異常振動を検知",
            "recommendations": "ベアリングの状態確認が必要",
            "measurements": {
                "vibration": f"{random.uniform(1.5, 4.0):.1f}mm/s",
                "temperature": f"{random.uniform(65, 85):.1f}°C",
                "noise_level": f"{random.uniform(75, 95):.1f}dB"
            }
        },
        {
            "type": "温度上昇",
            "findings": "モーターの温度が上昇傾向",
            "recommendations": "冷却システムの点検が必要",
            "measurements": {
                "temperature": f"{random.uniform(75, 95):.1f}°C",
                "current": f"{random.uniform(80, 120):.1f}A",
                "power_factor": f"{random.uniform(0.7, 0.9):.2f}"
            }
        },
        {
            "type": "異音発生",
            "findings": "運転中に異常な音が発生",
            "recommendations": "ギアボックスの点検が必要",
            "measurements": {
                "noise_level": f"{random.uniform(80, 100):.1f}dB",
                "vibration": f"{random.uniform(1.0, 3.0):.1f}mm/s",
                "oil_temperature": f"{random.uniform(60, 80):.1f}°C"
            }
        },
        {
            "type": "油圧低下",
            "findings": "油圧が低下傾向",
            "recommendations": "油圧システムの点検が必要",
            "measurements": {
                "oil_pressure": f"{random.uniform(2.0, 4.0):.1f}MPa",
                "oil_temperature": f"{random.uniform(50, 70):.1f}°C",
                "flow_rate": f"{random.uniform(10, 20):.1f}L/min"
            }
        },
        {
            "type": "正常",
            "findings": "異常なし",
            "recommendations": "通常運転継続",
            "measurements": {
                "vibration": f"{random.uniform(0.5, 1.5):.1f}mm/s",
                "temperature": f"{random.uniform(45, 65):.1f}°C",
                "noise_level": f"{random.uniform(60, 80):.1f}dB"
            }
        }
    ]
    
    # 点検記録の生成
    records = []
    base_date = datetime.now() - timedelta(days=30)
    
    for _ in range(num_records):
        # 日時の生成（過去30日以内）
        inspection_date = base_date + timedelta(
            days=random.randint(0, 30),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )
        
        # 異常パターンの選択
        pattern = random.choice(failure_patterns)
        
        # 記録の生成
        record = {
            "inspection_date": inspection_date.strftime("%Y-%m-%d %H:%M:%S"),
            "machine_id": random.choice(machine_ids),
            "inspection_type": random.choice(inspection_types),
            "findings": pattern["findings"],
            "recommendations": pattern["recommendations"],
            "measurements": pattern["measurements"],
            "inspector": f"点検員{random.randint(1, 5)}",
            "location": f"工場{random.choice(['A', 'B', 'C'])}-{random.randint(1, 5)}階",
            "status": "完了" if pattern["type"] == "正常" else "要対応"
        }
        
        records.append(record)
    
    return records

def save_dummy_data(records: list, output_dir: str = "data/inspections/raw"):
    """ダミーデータをJSONファイルとして保存"""
    
    # 出力ディレクトリの作成
    os.makedirs(output_dir, exist_ok=True)
    
    # 各記録を個別のファイルとして保存
    for i, record in enumerate(records):
        timestamp = datetime.strptime(record["inspection_date"], "%Y-%m-%d %H:%M:%S")
        filename = f"{timestamp.strftime('%Y%m%d_%H%M%S')}_inspection.json"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(record, f, ensure_ascii=False, indent=2)
        
        print(f"保存完了: {filepath}")

def main():
    # ダミーデータの生成（20件）
    records = generate_dummy_inspection_data(20)
    
    # データの保存
    save_dummy_data(records)
    
    print(f"\n合計{len(records)}件のダミーデータを生成しました。")

if __name__ == "__main__":
    main() 