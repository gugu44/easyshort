# EasyShort

EasyShort는 롱폼 영상, 숏폼 영상, 일반 영상, 사진, 대본을 입력받아 세로형 숏폼 영상을 제작하는 웹 기반 툴입니다.

## 현재 단계

현재 저장소는 제품 기획과 MVP 구축 계획을 먼저 정리하는 단계입니다.

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
