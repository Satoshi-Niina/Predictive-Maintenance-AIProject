from vectorize_and_predict import MaintenanceAnalyzer
import json
import os

def test_analysis():
    # アナライザーの初期化
    analyzer = MaintenanceAnalyzer()
    
    # テスト用のクエリ
    test_queries = [
        "モーターM001で温度上昇と異常振動が発生",
        "工場B-5階のモーターで異常が発生",
        "冷却システムの故障が疑われる",
        "ベアリングの異常音が発生"
    ]
    
    # 各クエリに対して分析を実行
    for query in test_queries:
        print(f"\n=== 分析クエリ: {query} ===")
        analysis = analyzer.analyze_failure_cause(query)
        
        # 分析結果の保存
        analyzer.save_analysis_result(analysis)
        
        # 結果の表示
        print("\n分析結果:")
        print(analysis["analysis"])

if __name__ == "__main__":
    test_analysis() 