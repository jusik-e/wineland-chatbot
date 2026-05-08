// ── Cloudflare Worker — Anthropic API 프록시 ──────────────
// 배포 방법:
// 1. https://workers.cloudflare.com 접속 → 로그인
// 2. "Create a Worker" 클릭
// 3. 아래 코드 전체 붙여넣기
// 4. "Settings" → "Variables" → Secret 추가: ANTHROPIC_API_KEY = sk-ant-...
// 5. 배포 후 Worker URL 복사 → index.html의 PROXY_URL에 붙여넣기

export default {
  async fetch(request, env) {
    // CORS preflight 처리
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const body = await request.json();

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: { message: '서버 오류: ' + err.message } }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
