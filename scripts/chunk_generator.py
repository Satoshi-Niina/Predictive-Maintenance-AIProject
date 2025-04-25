# 📁 ./scripts/chunk_generator.py

import os
import json

CHUNK_SIZE = 500
OVERLAP = 50

# 入力・出力パス
INPUT_PATH = "./data/raw/railway_maintenance_knowledge.txt"
OUTPUT_PATH = "./data/processed/chunks.json"
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

# テキスト読み込み
with open(INPUT_PATH, "r", encoding="utf-8") as f:
    text = f.read()

# チャンク分割処理
chunks = []
start = 0
while start < len(text):
    end = min(start + CHUNK_SIZE, len(text))
    chunks.append({
        "id": len(chunks),
        "content": text[start:end].strip()
    })
    start += CHUNK_SIZE - OVERLAP

# 保存
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(chunks, f, ensure_ascii=False, indent=2)

print(f"✅ チャンク {len(chunks)} 件を {OUTPUT_PATH} に保存しました")
