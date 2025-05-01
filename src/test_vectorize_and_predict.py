import os
import json
from vectorize_and_predict import MaintenanceAnalyzer

def test_maintenance_analyzer():
    # Initialize analyzer
    analyzer = MaintenanceAnalyzer()
    
    # Test data
    test_record = {
        "machine_id": "TEST001",
        "inspection_date": "2024-02-20",
        "type": "regular",
        "findings": "異常音が発生",
        "actions_taken": "部品の交換",
        "notes": "定期的なメンテナンスが必要"
    }
    
    # Test save_inspection_record
    record_path = analyzer.save_inspection_record(test_record)
    print(f"Saved record to: {record_path}")
    
    # Test process_inspection_record
    processed_path = analyzer.process_inspection_record(test_record)
    print(f"Processed record saved to: {processed_path}")
    
    # Test analyze_failure_cause
    query = "異常音の原因と対策について"
    analysis = analyzer.analyze_failure_cause(query)
    print("\nAnalysis Result:")
    print(json.dumps(analysis, indent=2, ensure_ascii=False))
    
    # Test save_analysis_result
    analysis_path = analyzer.save_analysis_result(analysis)
    print(f"\nAnalysis saved to: {analysis_path}")

if __name__ == "__main__":
    test_maintenance_analyzer() 