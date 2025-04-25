# 📁 scripts/qa_generator.py

import os
import json
import openai
from dotenv import load_dotenv

# .env から OPENAI_API_KEY を読み込む
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# 入出力パス
INPUT_PATH = "./data/processed/chunks.json"
OUTPUT_PATH = "./data/processed/qa_data.json"
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

# チャンク読み込み
with open(INPUT_PATH, "r", encoding="utf-8") as f:
    chunks = json.load(f)

# GPTに問い合わせる関数
def generate_qa(chunk_text):
    prompt = f"""
以下の内容に基づいて、1つの質問とその回答を日本語で作成してください。

--- 内容 ---
{chunk_text}
--- 出力形式 ---
{{"question": "...", "answer": "..."}}
"""
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "あなたは鉄道保守の専門家です。"},
            {"role": "user", "content": prompt}
        ]
    )
    # 応答からJSON部分だけ抽出
    content = response.choices[0].message.content.strip()
    return json.loads(content)

# 全チャンクにQ&Aを生成
qa_data = []
for chunk in chunks:
    try:
        qa = generate_qa(chunk["content"])
        qa["id"] = chunk["id"]
        qa_data.append(qa)
    except Exception as e:
        print(f"❌ chunk {chunk['id']} failed: {e}")

# 保存
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(qa_data, f, ensure_ascii=False, indent=2)

print(f"✅ Q&A生成完了: {len(qa_data)} 件を保存しました → {OUTPUT_PATH}")
