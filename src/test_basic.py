import os
from dotenv import load_dotenv
import json
from datetime import datetime

def test_basic_functionality():
    """基本的な機能テスト"""
    print("=== 基本機能テスト開始 ===")
    
    # 1. 環境変数の確認
    print("\n1. 環境変数の確認")
    load_dotenv()
    required_vars = ["PINECONE_API_KEY", "PINECONE_ENVIRONMENT", "OPENAI_API_KEY"]
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"✓ {var} が設定されています")
        else:
            print(f"✗ {var} が設定されていません")
    
    # 2. データディレクトリの確認
    print("\n2. データディレクトリの確認")
    required_dirs = [
        "data/inspections/raw",
        "data/inspections/processed"
    ]
    for dir_path in required_dirs:
        if os.path.exists(dir_path):
            print(f"✓ {dir_path} が存在します")
        else:
            print(f"✗ {dir_path} が存在しません")
            os.makedirs(dir_path, exist_ok=True)
            print(f"  → {dir_path} を作成しました")
    
    # 3. サンプルデータの確認
    print("\n3. サンプルデータの確認")
    raw_data_dir = "data/inspections/raw"
    if os.path.exists(raw_data_dir):
        files = os.listdir(raw_data_dir)
        if files:
            print(f"✓ {len(files)}件の点検記録が存在します")
            # 最新のファイルを表示
            latest_file = max(files, key=lambda x: os.path.getctime(os.path.join(raw_data_dir, x)))
            print(f"  最新のファイル: {latest_file}")
            
            # ファイルの内容を確認
            with open(os.path.join(raw_data_dir, latest_file), 'r', encoding='utf-8') as f:
                data = json.load(f)
                print("\n  サンプルデータの内容:")
                print(f"  機械ID: {data.get('machine_id')}")
                print(f"  点検日時: {data.get('inspection_date')}")
                print(f"  点検結果: {data.get('findings')}")
        else:
            print("✗ 点検記録が存在しません")
    else:
        print("✗ データディレクトリが存在しません")
    
    print("\n=== 基本機能テスト終了 ===")

if __name__ == "__main__":
    test_basic_functionality() 