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

## 7. B2C 사용자/권한 설계

### 7.1 인증 흐름

- 1차 MVP는 Supabase Auth 이메일 매직링크 로그인을 기본으로 사용합니다.
- 모든 보호 화면은 세션 확인 후 접근시키고, 비로그인 사용자는 `/login`으로 보냅니다.
- 로그인 성공 후에는 사용자가 처음 접근하려던 경로 또는 `/dashboard`로 복귀합니다.
- Edge Function/Worker 호출 시 Supabase JWT를 전달해 서버에서 `auth.uid()`와 요청 소유자를 검증합니다.

### 7.2 사용자별 데이터 소유권

- 모든 핵심 테이블은 `user_id uuid not null references auth.users(id)`를 포함합니다.
- `projects.id`만으로 데이터를 조회하지 않고 항상 `user_id + id` 조건을 함께 사용합니다.
- Storage object path는 `users/{user_id}/projects/{project_id}/...` 규칙을 사용합니다.
- 렌더링 워커가 결과를 저장할 때도 job의 `user_id`를 기준으로 output path를 생성합니다.

### 7.3 RLS 정책 초안

```sql
alter table projects enable row level security;

create policy "Users can read own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can create own projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on projects for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own projects"
  on projects for delete
  using (auth.uid() = user_id);
```

동일한 원칙을 `assets`, `scripts`, `transcripts`, `render_jobs`, `api_provider_settings`에 적용합니다.

### 7.4 플랜/사용량 테이블 추가

#### profiles

```txt
id -- auth.users.id
email
plan_id
display_name
created_at
updated_at
```

#### plans

```txt
id
name
monthly_project_limit
render_credit_limit
storage_limit_mb
price_monthly
created_at
```

#### usage_counters

```txt
id
user_id
period_month
project_count
render_credit_used
storage_used_mb
updated_at
```

### 7.5 Quota 체크 지점

- `POST /projects`: 월간 프로젝트 생성 한도를 확인합니다.
- `POST /assets/upload-url`: 사용자 저장소 한도와 파일 크기를 확인합니다.
- `POST /scripts/generate`: 무료 플랜 AI 생성 횟수 또는 크레딧을 확인합니다.
- `POST /voice/generate`: TTS provider 비용이 발생하기 전에 크레딧을 확인합니다.
- `POST /render-jobs`: 렌더 크레딧과 동시 job 수를 확인합니다.
