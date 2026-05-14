import { NavLink, Outlet } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';

export function AppShell() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/dashboard" className="brand" aria-label="EasyShort 대시보드">
          <span className="brand-mark">ES</span>
          <span>
            <strong>EasyShort</strong>
            <small>숏폼 제작 워크스페이스</small>
          </span>
        </NavLink>

        <nav className="nav-list" aria-label="주요 메뉴">
          <NavLink to="/dashboard">대시보드</NavLink>
          <NavLink to="/projects/new">새 프로젝트</NavLink>
        </nav>

        <div className="provider-card">
          <span className={isSupabaseConfigured ? 'status-dot ok' : 'status-dot'} />
          <div>
            <strong>Supabase</strong>
            <p>{isSupabaseConfigured ? '환경 변수가 연결되었습니다.' : '환경 변수 연결 대기 중'}</p>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}
