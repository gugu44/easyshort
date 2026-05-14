import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';

export function AuthStatus() {
  const { isConfigured, isLoading, userEmail, signInWithMagicLink, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleMagicLink = async () => {
    if (!email) {
      return;
    }

    const result = await signInWithMagicLink(email);
    setMessage(result.error ?? '로그인 링크를 이메일로 보냈습니다.');
  };

  const handleSignOut = async () => {
    await signOut();
    setMessage('로그아웃되었습니다.');
  };

  if (!isConfigured) {
    return (
      <div className="auth-card muted">
        <strong>Supabase Auth 연결 준비</strong>
        <p>.env에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정하면 사용자별 로그인을 사용할 수 있습니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="auth-card muted">
        <strong>로그인 확인 중</strong>
        <p>세션을 불러오고 있습니다.</p>
      </div>
    );
  }

  if (userEmail) {
    return (
      <div className="auth-card">
        <div>
          <span>개인 워크스페이스</span>
          <strong>{userEmail}</strong>
        </div>
        <button type="button" onClick={handleSignOut}>
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <label htmlFor="email">매직링크 로그인</label>
      <div className="auth-form">
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
        <button type="button" onClick={handleMagicLink} disabled={!email}>
          보내기
        </button>
      </div>
      {message ? <p>{message}</p> : null}
    </div>
  );
}
