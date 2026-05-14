import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

type LoginPageProps = {
  mode?: 'login' | 'setup';
};

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export function LoginPage({ mode = 'login' }: LoginPageProps) {
  const { isConfigured, isLoading, session, signInWithMagicLink } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const locationState = location.state as LocationState | null;
  const redirectTo = locationState?.from?.pathname ?? '/dashboard';

  if (mode === 'login' && isConfigured && !isLoading && session) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async () => {
    if (!email) {
      return;
    }

    const result = await signInWithMagicLink(email);
    setMessage(result.error ?? '로그인 링크를 이메일로 보냈습니다. 메일함에서 인증을 완료하세요.');
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <p className="eyebrow">B2C 개인 워크스페이스</p>
        <h1>로그인 후 내 프로젝트와 사용량을 관리하세요.</h1>
        <p>
          EasyShort는 사용자 계정별로 프로젝트, 업로드 파일, 렌더링 결과, 월간 사용량을 분리하는 B2C 모델로
          설계합니다.
        </p>

        {isConfigured ? (
          <div className="login-form">
            <label htmlFor="login-email">이메일</label>
            <div className="auth-form">
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
              <button type="button" onClick={handleSubmit} disabled={!email || isLoading}>
                매직링크 받기
              </button>
            </div>
            {message ? <p className="form-message">{message}</p> : null}
          </div>
        ) : (
          <div className="setup-card">
            <strong>Supabase Auth 설정이 필요합니다.</strong>
            <p>
              `.env`에 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`를 추가하면 사용자별 로그인 플로우가
              활성화됩니다.
            </p>
          </div>
        )}
      </div>

      <aside className="login-side-card">
        <h2>B2C 전환 핵심</h2>
        <ul>
          <li>모든 프로젝트는 `user_id` 소유자를 갖습니다.</li>
          <li>대시보드는 로그인한 사용자의 데이터만 조회합니다.</li>
          <li>무료/유료 플랜별 생성 횟수와 저장소 한도를 계산합니다.</li>
          <li>RLS 정책으로 다른 사용자의 파일과 결과 접근을 차단합니다.</li>
        </ul>
      </aside>
    </section>
  );
}
