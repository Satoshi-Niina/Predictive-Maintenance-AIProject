
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const router = express.Router();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post("/analyze-inspection", async (req, res) => {
  try {
    const { machine_id, inspection_data, note } = req.body;

    const prompt = `以下は機械ID ${machine_id} の点検記録です。\n` +
      `圧力・電圧・摩耗の推移を確認し、異常傾向があるか判断してください。\n` +
      `また、以下のメモに基づき、過去の傾向から原因と対策候補を推定してください。\n\n` +
      `--- 点検データ ---\n` +
      inspection_data.map(d => `日付: ${d.date}｜圧力: ${d.pressure}｜電圧: ${d.voltage}｜摩耗: ${d.wear}`).join("\n") +
      `\n\n--- メモ ---\n${note}\n\n` +
      `--- 指示 ---\n1. 異常傾向の有無\n2. 原因推定\n3. 対策候補\n`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "あなたは保守用車の点検データから異常を診断する整備士です。" },
        { role: "user", content: prompt }
      ]
    });

    res.json({ result: completion.data.choices[0].message.content });

  } catch (error) {
    console.error("エラー:", error);
    res.status(500).json({ error: "分析に失敗しました" });
  }
});

module.exports = router;
