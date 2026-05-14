# EasyShort

EasyShort는 롱폼 영상, 숏폼 영상, 일반 영상, 사진, 대본을 입력받아 세로형 숏폼 영상을 제작하는 웹 기반 툴입니다.

## 현재 단계

로드맵의 **Phase 1. 프로젝트 기반 구축**을 시작했습니다.

- React + Vite 기반 프론트엔드 앱
- Cloudflare Pages 배포 설정(`wrangler.toml`)
- Supabase Auth 클라이언트 연결 골격
- React Router 기반 기본 라우팅
- 대시보드와 새 프로젝트 생성 화면

제품 기획 문서는 아래에서 확인할 수 있습니다.

1. [제품 로드맵](docs/product/roadmap.md)
2. [사진 → 숏폼 MVP 화면 기획](docs/product/photo-to-short-mvp.md)
3. [백엔드/API 구성 계획](docs/product/backend-api-plan.md)

## 초기 기술 방향

- Frontend: React + Vite
- Hosting: Cloudflare Pages
- Auth/DB: Supabase
- Storage: Supabase Storage 우선, 필요 시 Cloudflare R2 확장
- Backend: Supabase Edge Functions 우선, 필요 시 Cloudflare Workers/Queues 확장
- Rendering: MVP는 브라우저 기반 미리보기/렌더링, 고도화 시 외부 렌더링 워커 도입

## 로컬 실행

```bash
npm install
cp .env.example .env
npm run dev
```

Supabase Auth를 실제로 사용하려면 `.env`에 아래 값을 채워 넣습니다.

```bash
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-public-anon-key"
```

## 주요 스크립트

- `npm run dev`: Vite 개발 서버 실행
- `npm run build`: TypeScript 검사 후 프로덕션 빌드
- `npm run lint`: ESLint 검사

## 다음 구현 순서

1. Supabase 프로젝트/Storage 준비
2. `projects`, `assets` 테이블 마이그레이션 작성
3. 사진 업로드 및 진행률 UI 구현
4. 사진 순서 변경과 직접 대본 작성 화면 연결
