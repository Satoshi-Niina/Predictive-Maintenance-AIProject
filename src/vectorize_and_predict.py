import os
import json
from typing import List, Dict, Tuple
from datetime import datetime
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores.pinecone import Pinecone as LangchainPinecone
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

# Load environment variables
load_dotenv()

class MaintenanceAnalyzer:
    def __init__(self):
        # Initialize Pinecone
        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        
        # Initialize OpenAI embeddings
        self.embeddings = OpenAIEmbeddings()
        
        # Initialize LLM
        self.llm = ChatOpenAI(temperature=0)
        
        # Create index if it doesn't exist
        self.index_name = "maintenance-analysis"
        
        # Check if index exists
        if self.index_name not in [index.name for index in pc.list_indexes()]:
            # Create index if it doesn't exist
            pc.create_index(
                name=self.index_name,
                dimension=1536,  # OpenAI embeddings dimension
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="gcp",
                    region="gcp-starter"
                )
            )
        
        self.index = pc.Index(self.index_name)
        self.vectorstore = LangchainPinecone(self.index, self.embeddings, "text")
        
        # Create necessary directories
        self.create_data_directories()

    def create_data_directories(self):
        """Create necessary directories for data storage."""
        directories = [
            "data/inspections",
            "data/inspections/raw",
            "data/inspections/processed"
        ]
        for directory in directories:
            os.makedirs(directory, exist_ok=True)

    def save_inspection_record(self, record: Dict) -> str:
        """Save inspection record to file and return the file path."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"data/inspections/raw/{timestamp}_inspection.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(record, f, ensure_ascii=False, indent=2)
        
        return filename

    def process_inspection_record(self, record: Dict) -> str:
        """Process a single inspection record and return its vector representation."""
        # Save raw record
        self.save_inspection_record(record)
        
        # Convert record to text format
        text = self._format_record_as_text(record)
        
        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        chunks = text_splitter.split_text(text)
        
        # Store chunks in Pinecone
        self.vectorstore.add_texts(chunks)
        
        return text

    def _format_record_as_text(self, record: Dict) -> str:
        """Format inspection record as text for processing."""
        return f"""
        点検日時: {record.get('inspection_date', 'N/A')}
        機械ID: {record.get('machine_id', 'N/A')}
        点検タイプ: {record.get('inspection_type', 'N/A')}
        点検結果: {record.get('findings', 'N/A')}
        推奨事項: {record.get('recommendations', 'N/A')}
        測定値: {record.get('measurements', 'N/A')}
        """

    def analyze_failure_cause(self, query: str) -> Dict:
        """Analyze failure cause and provide countermeasures."""
        # Create prompt template
        template = """
        以下の情報に基づいて、機械故障の原因分析と対策を提案してください：

        類似の点検記録:
        {inspection_context}

        類似の故障事例:
        {failure_context}

        関連する技術ナレッジ:
        {knowledge_context}

        現在の状況:
        {query}

        以下の形式で回答してください：

        1. 原因分析
        - 考えられる原因
        - 発生メカニズム
        - 影響範囲

        2. 対策提案
        - 緊急対応
        - 予防対策
        - 長期的な改善案

        3. リスク評価
        - 発生確率
        - 影響度
        - 優先度
        """

        prompt = ChatPromptTemplate.from_template(template)
        
        # Create chain
        chain = LLMChain(llm=self.llm, prompt=prompt)
        
        # Get similar records
        similar_inspections = self.vectorstore.similarity_search(
            query, 
            k=3,
            filter={"type": "inspection"}
        )
        inspection_context = "\n".join([doc.page_content for doc in similar_inspections])
        
        similar_failures = self.vectorstore.similarity_search(
            query,
            k=3,
            filter={"type": "failure"}
        )
        failure_context = "\n".join([doc.page_content for doc in similar_failures])
        
        similar_knowledge = self.vectorstore.similarity_search(
            query,
            k=3,
            filter={"type": "knowledge"}
        )
        knowledge_context = "\n".join([doc.page_content for doc in similar_knowledge])
        
        # Generate analysis
        result = chain.invoke({
            "inspection_context": inspection_context,
            "failure_context": failure_context,
            "knowledge_context": knowledge_context,
            "query": query
        })
        
        return {
            "analysis": result["text"],
            "timestamp": datetime.now().isoformat(),
            "query": query
        }

    def save_analysis_result(self, analysis: Dict) -> str:
        """Save analysis result to file and return the file path."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"data/inspections/processed/{timestamp}_analysis.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, ensure_ascii=False, indent=2)
        
        return filename

def main():
    # Initialize analyzer
    analyzer = MaintenanceAnalyzer()
    
    # Example usage
    sample_record = {
        "inspection_date": "2024-02-20",
        "machine_id": "M123",
        "inspection_type": "定期点検",
        "findings": "モーターの異常振動を検知",
        "recommendations": "ベアリングの状態確認が必要",
        "measurements": {
            "vibration": "2.5mm/s",
            "temperature": "75°C",
            "noise_level": "85dB"
        }
    }
    
    # Process record
    analyzer.process_inspection_record(sample_record)
    
    # Analyze failure
    query = "モーターM123で異常振動が発生し、温度も上昇傾向"
    analysis = analyzer.analyze_failure_cause(query)
    
    # Save analysis result
    analyzer.save_analysis_result(analysis)
    print("分析結果:", analysis["analysis"])

if __name__ == "__main__":
    main() 