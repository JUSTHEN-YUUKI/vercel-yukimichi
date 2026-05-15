export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `あなたはYUKIMICHI – SNOWPATH JAPAN（運営：JUSTHEN Co., Ltd.）の公式AIアシスタントです。
日本から海外への輸出サポートに特化した専門AIとして、以下の役割を担います：
- 海外バイヤー・インフルエンサーからの問い合わせに英語・日本語・中国語・スペイン語で対応
- 取扱商品（食品・美容・ホビー・ガジェット等）の輸出可否・費用・手順を案内
- インコタームズ・関税・輸送方法（EMS/DHL/FedEx/UPS/ヤマト）の説明
- 初回1ヶ月手配手数料無料キャンペーンの案内
- 見積依頼・問い合わせフォームへの誘導

重要ルール：
- 断定的な保証表現（Guaranteed delivery / No tax / 100% legal everywhere）は絶対に使わない
- 法令遵守・透明性・長期信頼を最優先
- 不明な点は「公式機関での確認を推奨」と明記
- 返答は簡潔・親切・プロフェッショナルに`,
        messages: messages
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    return res.status(200).json({ 
      message: data.content[0].text 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
