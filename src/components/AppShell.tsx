import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { isSupabaseConfigured } from '../lib/supabase';

export function AppShell() {
  const { userEmail } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/dashboard" className="brand" aria-label="EasyShort 대시보드">
          <span className="brand-mark">ES</span>
          <span>
            <strong>EasyShort</strong>
            <small>B2C 개인 숏폼 스튜디오</small>
          </span>
        </NavLink>

        <nav className="nav-list" aria-label="주요 메뉴">
          <NavLink to="/dashboard">내 대시보드</NavLink>
          <NavLink to="/projects/new">새 프로젝트</NavLink>
        </nav>

        <div className="provider-card">
          <span className={isSupabaseConfigured ? 'status-dot ok' : 'status-dot'} />
          <div>
            <strong>{userEmail ?? 'Supabase Auth'}</strong>
            <p>{isSupabaseConfigured ? '사용자별 세션이 활성화되었습니다.' : '환경 변수 연결 대기 중'}</p>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}
