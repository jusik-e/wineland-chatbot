# 와인랜드 VIP 소믈리에 챗봇

## 배포 구조
```
GitHub Pages (index.html) → Cloudflare Worker (프록시) → Anthropic API
```

---

## Step 1. Cloudflare Worker 설정 (API 키 보호)

### 1-1. Cloudflare 계정 만들기
https://cloudflare.com → 무료 가입

### 1-2. Worker 만들기
1. 대시보드 → **Workers & Pages** → **Create** → **Create Worker**
2. Worker 이름 입력 (예: `wineland-proxy`)
3. 기본 코드 전체 삭제 후 `worker.js` 내용 전체 붙여넣기
4. **Deploy** 클릭

### 1-3. API 키 환경변수 설정
1. Worker 페이지 → **Settings** → **Variables and Secrets**
2. **Add** → Type: **Secret** 선택
3. Variable name: `ANTHROPIC_API_KEY`
4. Value: `sk-ant-api03-...` (실제 API 키 입력)
5. **Deploy** 클릭

### 1-4. Worker URL 복사
배포 후 표시되는 URL 복사  
예: `https://wineland-proxy.myname.workers.dev`

---

## Step 2. GitHub Pages 배포

### 2-1. index.html 수정
`index.html` 파일을 열어 상단 PROXY_URL 수정:
```javascript
// 변경 전
var PROXY_URL = 'https://YOUR_WORKER.YOUR_SUBDOMAIN.workers.dev/api/chat';

// 변경 후 (Step 1-4에서 복사한 URL + /api/chat)
var PROXY_URL = 'https://wineland-proxy.myname.workers.dev/api/chat';
```

### 2-2. GitHub 저장소 만들기
1. https://github.com → **New repository**
2. Repository name: `wineland-chatbot` (원하는 이름)
3. **Public** 선택 → **Create repository**

### 2-3. 파일 업로드
```bash
# 방법 A: Git 사용
git init
git add index.html
git commit -m "Add wineland chatbot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wineland-chatbot.git
git push -u origin main

# 방법 B: GitHub 웹에서 직접 업로드
# 저장소 페이지 → "uploading an existing file" 클릭 → index.html 드래그
```

### 2-4. GitHub Pages 활성화
1. 저장소 → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **/ (root)** 선택
4. **Save**

### 2-5. 접속 확인
약 1~2분 후 아래 URL에서 접속 가능:
```
https://YOUR_USERNAME.github.io/wineland-chatbot/
```

---

## 파일 구성
```
wineland-chatbot/
├── index.html    ← 챗봇 (GitHub Pages로 서빙)
├── worker.js     ← Cloudflare Worker 코드 (참고용, GitHub엔 필수 아님)
└── README.md     ← 이 파일
```

## 비용
- GitHub Pages: **무료**
- Cloudflare Worker: **무료** (일 10만 요청까지)
- Anthropic API: 사용량 기준 과금

## 문의
www.wineland.co.kr
