import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export function AuthStatus() {
  const [email, setEmail] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const handleMagicLink = async () => {
    if (!supabase || !email) {
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setMessage(error ? error.message : '로그인 링크를 이메일로 보냈습니다.');
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setMessage('로그아웃되었습니다.');
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="auth-card muted">
        <strong>Supabase Auth 연결 준비</strong>
        <p>.env에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정하면 매직링크 로그인을 사용할 수 있습니다.</p>
      </div>
    );
  }

  if (session?.user.email) {
    return (
      <div className="auth-card">
        <span>로그인됨</span>
        <strong>{session.user.email}</strong>
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
