const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// 技術ナレッジ一覧の取得
router.get('/knowledge', async (req, res) => {
  try {
    const knowledgeDir = path.join(__dirname, '../../data/knowledge');
    const files = await fs.readdir(knowledgeDir);
    const knowledgeList = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(knowledgeDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(content);
        knowledgeList.push({
          id: file.replace('.json', ''),
          title: data.diagnostics.primary_problem,
          description: data.diagnostics.problem_description,
          components: data.diagnostics.components,
          timestamp: data.timestamp
        });
      }
    }

    res.json({
      status: 'success',
      knowledge: knowledgeList
    });
  } catch (error) {
    console.error('Error fetching knowledge list:', error);
    res.status(500).json({
      status: 'error',
      message: '技術ナレッジの取得に失敗しました'
    });
  }
});

// 技術ナレッジの詳細取得
router.get('/knowledge/:id', async (req, res) => {
  try {
    const knowledgeId = req.params.id;
    const filePath = path.join(__dirname, '../../data/knowledge', `${knowledgeId}.json`);
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);

    res.json({
      status: 'success',
      knowledge: data
    });
  } catch (error) {
    console.error('Error fetching knowledge details:', error);
    res.status(500).json({
      status: 'error',
      message: '技術ナレッジの詳細取得に失敗しました'
    });
  }
});

// 技術ナレッジの検索
router.get('/knowledge/search', async (req, res) => {
  try {
    const query = req.query.q;
    const knowledgeDir = path.join(__dirname, '../../data/knowledge');
    const files = await fs.readdir(knowledgeDir);
    const searchResults = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(knowledgeDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(content);

        // 検索条件に一致するかチェック
        if (
          data.diagnostics.primary_problem.includes(query) ||
          data.diagnostics.problem_description.includes(query) ||
          data.diagnostics.components.some(comp => comp.includes(query))
        ) {
          searchResults.push({
            id: file.replace('.json', ''),
            title: data.diagnostics.primary_problem,
            description: data.diagnostics.problem_description,
            components: data.diagnostics.components,
            timestamp: data.timestamp
          });
        }
      }
    }

    res.json({
      status: 'success',
      results: searchResults
    });
  } catch (error) {
    console.error('Error searching knowledge:', error);
    res.status(500).json({
      status: 'error',
      message: '技術ナレッジの検索に失敗しました'
    });
  }
});

module.exports = router; 