import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import pool from '../db/config';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { ExcelLoader } from 'langchain/document_loaders/fs/excel';
import { PPTXLoader } from 'langchain/document_loaders/fs/pptx';
import { TextLoader } from 'langchain/document_loaders/fs/text';

export class DocumentProcessor {
  private textSplitter: RecursiveCharacterTextSplitter;
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    this.embeddings = new OpenAIEmbeddings();
  }

  async processFile(file: Express.Multer.File): Promise<void> {
    let loader;
    const fileType = file.mimetype;

    switch (fileType) {
      case 'application/pdf':
        loader = new PDFLoader(file.path);
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        loader = new DocxLoader(file.path);
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        loader = new ExcelLoader(file.path);
        break;
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        loader = new PPTXLoader(file.path);
        break;
      case 'text/plain':
        loader = new TextLoader(file.path);
        break;
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }

    const docs = await loader.load();
    const chunks = await this.textSplitter.splitDocuments(docs);

    // ドキュメントをデータベースに保存
    const documentResult = await pool.query(
      'INSERT INTO documents (file_name, file_type, file_path, content) VALUES ($1, $2, $3, $4) RETURNING id',
      [file.originalname, fileType, file.path, docs[0].pageContent]
    );
    const documentId = documentResult.rows[0].id;

    // チャンクをデータベースに保存
    for (const chunk of chunks) {
      const embedding = await this.embeddings.embedQuery(chunk.pageContent);
      await pool.query(
        'INSERT INTO chunks (document_id, content, embedding) VALUES ($1, $2, $3)',
        [documentId, chunk.pageContent, embedding]
      );
    }
  }

  async processJsonData(data: any): Promise<void> {
    const text = JSON.stringify(data);
    const docs = [new Document({ pageContent: text })];
    const chunks = await this.textSplitter.splitDocuments(docs);

    // ドキュメントをデータベースに保存
    const documentResult = await pool.query(
      'INSERT INTO documents (file_name, file_type, content) VALUES ($1, $2, $3) RETURNING id',
      ['json_data', 'application/json', text]
    );
    const documentId = documentResult.rows[0].id;

    // チャンクをデータベースに保存
    for (const chunk of chunks) {
      const embedding = await this.embeddings.embedQuery(chunk.pageContent);
      await pool.query(
        'INSERT INTO chunks (document_id, content, embedding) VALUES ($1, $2, $3)',
        [documentId, chunk.pageContent, embedding]
      );
    }
  }

  async processImage(imagePath: string, extractedText: string): Promise<void> {
    const docs = [new Document({ 
      pageContent: extractedText,
      metadata: { imagePath }
    })];
    const chunks = await this.textSplitter.splitDocuments(docs);

    // ドキュメントをデータベースに保存
    const documentResult = await pool.query(
      'INSERT INTO documents (file_name, file_type, file_path, content) VALUES ($1, $2, $3, $4) RETURNING id',
      [imagePath, 'image', imagePath, extractedText]
    );
    const documentId = documentResult.rows[0].id;

    // チャンクをデータベースに保存
    for (const chunk of chunks) {
      const embedding = await this.embeddings.embedQuery(chunk.pageContent);
      await pool.query(
        'INSERT INTO chunks (document_id, content, embedding) VALUES ($1, $2, $3)',
        [documentId, chunk.pageContent, embedding]
      );
    }
  }

  async searchSimilarDocuments(query: string, k: number = 5): Promise<Document[]> {
    const queryEmbedding = await this.embeddings.embedQuery(query);
    
    const result = await pool.query(
      `SELECT c.content, c.embedding <=> $1 as distance
       FROM chunks c
       ORDER BY distance
       LIMIT $2`,
      [queryEmbedding, k]
    );

    return result.rows.map(row => new Document({
      pageContent: row.content,
      metadata: { distance: row.distance }
    }));
  }
} 