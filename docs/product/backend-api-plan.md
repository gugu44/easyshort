# 백엔드/API 구성 계획

## 1. 권장 아키텍처

초기 MVP는 구현 속도와 운영 단순성을 위해 Supabase 중심으로 구성합니다. 이후 영상 처리량과 렌더링 시간이 증가하면 Cloudflare Workers, Cloudflare Queues, Cloudflare R2, 외부 렌더링 워커를 추가합니다.

```txt
React + Vite
→ Cloudflare Pages
→ Supabase Auth / Postgres / Storage / Edge Functions
→ Provider Adapters
→ Optional Cloudflare Workers / Queues / R2
→ Optional External Render Worker
```

## 2. 역할 분리

### 2.1 Frontend

- 화면 렌더링
- 파일 업로드 UI
- 편집기/미리보기
- 사용자 입력 validation
- Supabase Auth session 관리

### 2.2 Supabase

- 사용자 인증
- 프로젝트/에셋/대본/자막/렌더링 job 저장
- Storage 파일 저장
- Edge Functions로 provider API 중계

### 2.3 Cloudflare

- Cloudflare Pages로 정적 프론트엔드 배포
- 필요 시 Workers로 API gateway 구성
- 필요 시 Queues로 장기 작업 분리
- 필요 시 R2로 대용량 영상 저장

### 2.4 외부 렌더링 워커

- 장시간 영상 렌더링
- FFmpeg/Remotion 실행
- 결과 파일 업로드
- render_jobs 상태 업데이트

## 3. Provider Adapter 구조

외부 API는 직접 화면에서 호출하지 않고 backend function을 통해 호출합니다.

```txt
React
→ /functions/generate-script
→ LLM Provider Adapter
→ Provider API
```

### 3.1 Provider 카테고리

- LLM: 대본 생성, 하이라이트 분석
- STT: 음성 인식, 자동 자막
- TTS: Typecast 등 음성 합성
- Render: 영상 렌더링
- Storage: 파일 저장

### 3.2 무료/유료 provider 전략

| 카테고리 | 무료 테스트 | 유료/고도화 |
| --- | --- | --- |
| LLM | mock/free quota provider | OpenAI, Claude, Gemini |
| STT | Cloudflare Workers AI Whisper 또는 mock | OpenAI Whisper, Deepgram, AssemblyAI |
| TTS | Browser TTS, mock TTS | Typecast, ElevenLabs, OpenAI TTS |
| Render | Browser FFmpeg/Canvas | Remotion worker, RunPod, Modal |
| Storage | Supabase Storage free 범위 | Cloudflare R2, S3 |

## 4. API Key 보안 원칙

- API Key는 프론트엔드 번들에 포함하지 않습니다.
- 사용자가 입력한 API Key는 서버에서 암호화해 저장합니다.
- provider 호출은 Edge Function 또는 Worker에서 수행합니다.
- 로그에 API Key를 남기지 않습니다.
- provider 테스트 호출 결과는 성공/실패와 최소 메시지만 저장합니다.

## 5. 핵심 테이블 초안

### 5.1 projects

```txt
id
user_id
title
type
status
source_type
duration
aspect_ratio
thumbnail_url
created_at
updated_at
```

### 5.2 assets

```txt
id
project_id
user_id
asset_type
file_url
storage_provider
mime_type
size
duration
width
height
created_at
```

### 5.3 scripts

```txt
id
project_id
mode
title
hook
body
cta
script_text
segments_json
provider
created_at
```

### 5.4 transcripts

```txt
id
project_id
language
raw_text
segments_json
provider
created_at
```

### 5.5 render_jobs

```txt
id
project_id
user_id
status
progress
input_json
output_url
error_message
provider
created_at
updated_at
```

### 5.6 api_provider_settings

```txt
id
user_id
category
provider_name
mode
api_key_encrypted
config_json
is_default
created_at
updated_at
```

## 6. API 초안

### 6.1 프로젝트

- `POST /projects`
- `GET /projects`
- `GET /projects/:id`
- `PATCH /projects/:id`
- `DELETE /projects/:id`

### 6.2 에셋

- `POST /assets/upload-url`
- `POST /assets`
- `GET /projects/:id/assets`
- `DELETE /assets/:id`

### 6.3 대본

- `POST /scripts/generate`
- `POST /scripts`
- `PATCH /scripts/:id`
- `POST /scripts/:id/split-subtitles`

### 6.4 음성

- `GET /voice/providers`
- `GET /voice/providers/:provider/voices`
- `POST /voice/generate`
- `POST /voice/preview`

### 6.5 렌더링

- `POST /render-jobs`
- `GET /render-jobs/:id`
- `POST /render-jobs/:id/retry`

### 6.6 Provider 설정

- `GET /settings/providers`
- `POST /settings/providers`
- `PATCH /settings/providers/:id`
- `POST /settings/providers/:id/test`

## 7. 비동기 job 원칙

영상 생성, STT, TTS, 하이라이트 분석처럼 오래 걸릴 수 있는 작업은 `render_jobs` 또는 별도 job 테이블로 상태를 추적합니다.

```txt
queued
→ processing
→ completed
```

실패 시에는 아래 정보를 저장합니다.

```txt
failed_stage
error_message
retryable
provider
```

## 8. MVP 구현 순서

1. Supabase Auth 연결
2. projects/assets 테이블 작성
3. 사진 업로드 구현
4. scripts 저장과 subtitle split 구현
5. provider 설정 UI 구현
6. mock/free TTS 구현
7. render_jobs 상태 모델 구현
8. 브라우저 렌더링 또는 외부 렌더링 job 연결
