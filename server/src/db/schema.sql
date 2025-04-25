-- ドキュメントテーブル
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- チャンクテーブル
CREATE TABLE chunks (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id),
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- OpenAIのembedding次元数
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 故障履歴テーブル
CREATE TABLE failure_history (
    id SERIAL PRIMARY KEY,
    machine_id VARCHAR(50) NOT NULL,
    failure_description TEXT NOT NULL,
    analysis_result TEXT,
    maintenance_items TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 画像データテーブル
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    failure_history_id INTEGER REFERENCES failure_history(id),
    image_path VARCHAR(255) NOT NULL,
    extracted_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- メンテナンス計画テーブル
CREATE TABLE maintenance_plans (
    id SERIAL PRIMARY KEY,
    machine_id VARCHAR(50) NOT NULL,
    maintenance_type VARCHAR(50) NOT NULL,
    schedule_date DATE NOT NULL,
    items_to_check TEXT,
    parts_to_replace TEXT,
    estimated_cost DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 