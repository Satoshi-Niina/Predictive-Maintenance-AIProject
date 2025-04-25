# Emergency AI Project
各種データを読み込み、openaiから回答予測するシステムです。
１.事前にGPT用のナレッジデータを読み込むUI
２.随時、機械故障報告の外部データ（json・画像）を保存し、１項に追加する
３.バックグランドで、チャンク・ベクトル化等のGPT用データ処理する
４.フロントからのリクエストで、GPTを活用して機械故障や原因、予防策等を分析する
５.結果のレスポンスを表示する

今後、この回答予測を活用して、仕業点検項目や機械検修項目に反映する
また、適切な機械検修の周期、検修項目の選択も可能とする。

ローカルで実行できるAI機械管理支援システムです。


技術的情報

フロントエンド（client/）:React + Vite + TypeScript
TailwindCSS でスタイル定義

主な画面:
UploadKnowledge.tsx：ナレッジファイル（PPTX, PDFなど）のアップロード画面
History.tsx：応答履歴表示
RequestResponseView.tsx：質問とAIの回答表示

バックエンド（server/）:Node.js + Express

ルート構成
upload.js：ファイルアップロード
ask.js：質問送信と応答取得
history.js：履歴取得・保存

AIエンジン（ai_engine/）:
Python
main.py：ナレッジファイルを処理し、GPTベースの応答生成
predict_response.py：検索と応答生成のロジック

