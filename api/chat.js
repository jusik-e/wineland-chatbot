// 와인랜드 챗봇 서버: 브라우저 요청을 Claude API로 전달합니다.
// API 키는 Vercel 환경변수 ANTHROPIC_API_KEY 에만 넣으세요 (코드에 직접 쓰지 마세요).
// 남용 방지: 모델·최대 길이는 서버에서 고정하고, 대화 길이를 제한합니다.

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 2000;
const MAX_MESSAGES = 20;
const MAX_CHARS = 60000; // 시스템 지시문을 뺀 대화 전체 글자 수 한도

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: { message: 'Method Not Allowed' } });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: { message: 'API key not configured' } });

  const body = req.body || {};
  const system = typeof body.system === 'string' ? body.system : '';
  const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];

  const valid = messages.length > 0 && messages.every(
    (m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
  );
  if (!valid) return res.status(400).json({ error: { message: 'Bad request' } });
  if (!system.includes('와인랜드')) return res.status(400).json({ error: { message: 'Bad request' } });
  const size = messages.reduce((n, m) => n + m.content.length, 0);
  if (size > MAX_CHARS) return res.status(413).json({ error: { message: '대화가 너무 깁니다. 새로고침 후 다시 시도해 주세요.' } });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, system, messages }),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
};
