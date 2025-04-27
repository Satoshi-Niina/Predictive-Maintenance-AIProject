from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import json
import os
from .fault_data_loader import FaultDataLoader

app = FastAPI()
fault_loader = FaultDataLoader()

@app.get("/")
async def root():
    return {"message": "Emergency AI Engine is running"}

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

class Query(BaseModel):
    query: str

@app.post("/api/predict")
async def predict(query: Query):
    # TODO: 実際の予測ロジックを実装
    return {"answer": f"回答: {query.query}"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = f"data/raw/{file.filename}"
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
    
    return {"message": "ファイルがアップロードされました", "filename": file.filename}

@app.get("/api/history")
async def get_history():
    # TODO: 実際の履歴取得ロジックを実装
    return {"history": []}

@app.get("/api/fault-data")
async def get_fault_data():
    """最新の故障情報を取得"""
    data = fault_loader.get_latest_fault_data()
    if data:
        return {
            "status": "success",
            "data": data
        }
    return {
        "status": "error",
        "message": "故障情報が見つかりません"
    }

@app.get("/api/fault-history")
async def get_fault_history():
    """故障履歴を取得"""
    data = fault_loader.get_latest_fault_data()
    if data:
        return {
            "status": "success",
            "history": data.get('conversation_history', [])
        }
    return {
        "status": "error",
        "message": "故障履歴が見つかりません"
    }

@app.get("/api/diagnostics")
async def get_diagnostics():
    """診断情報を取得"""
    data = fault_loader.get_latest_fault_data()
    if data:
        return {
            "status": "success",
            "diagnostics": data.get('diagnostics', {})
        }
    return {
        "status": "error",
        "message": "診断情報が見つかりません"
    }
