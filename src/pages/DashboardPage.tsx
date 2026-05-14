import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { AuthStatus } from '../components/AuthStatus';
import {
  currentUserPlan,
  getProjectsForUser,
  statusLabels,
  typeLabels,
  type ProjectStatus,
} from '../data/projects';

const filters: Array<'all' | ProjectStatus> = ['all', 'draft', 'rendering', 'completed', 'failed'];

const filterLabels: Record<(typeof filters)[number], string> = {
  all: '전체',
  ...statusLabels,
};

export function DashboardPage() {
  const { userEmail } = useAuth();
  const userProjects = getProjectsForUser(userEmail);
  const completedCount = userProjects.filter((project) => project.status === 'completed').length;
  const storageUsedMb = userProjects.reduce((total, project) => total + project.usedStorageMb, 0);
  const storageUsedGb = (storageUsedMb / 1024).toFixed(1);
  const storageLimitGb = (currentUserPlan.storageLimitMb / 1024).toFixed(0);

  return (
    <section className="page-stack">
      <header className="hero-card">
        <div>
          <p className="eyebrow">B2C MVP · 개인 워크스페이스</p>
          <h1>{userEmail ? `${userEmail}님의 숏폼 스튜디오` : '내 숏폼 스튜디오'}</h1>
          <p>
            로그인한 사용자 기준으로 프로젝트, 업로드 파일, 렌더링 결과, 월간 사용량을 분리해 관리하도록
            대시보드 구조를 전환했습니다.
          </p>
        </div>
        <Link className="primary-button" to="/projects/new">
          새 프로젝트 만들기
        </Link>
      </header>

      <AuthStatus />

      <div className="metric-grid" aria-label="사용량 요약">
        <article className="metric-card">
          <span>이번 달 생성</span>
          <strong>
            {userProjects.length}/{currentUserPlan.monthlyProjectLimit}
          </strong>
          <small>{currentUserPlan.name} 플랜 프로젝트 한도</small>
        </article>
        <article className="metric-card">
          <span>완료</span>
          <strong>{completedCount}</strong>
          <small>다운로드 가능</small>
        </article>
        <article className="metric-card">
          <span>저장소</span>
          <strong>
            {storageUsedGb}GB/{storageLimitGb}GB
          </strong>
          <small>사용자별 Supabase Storage 사용량</small>
        </article>
      </div>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">My Projects</p>
            <h2>내 프로젝트 목록</h2>
          </div>
          <div className="filter-row" aria-label="프로젝트 상태 필터">
            {filters.map((filter) => (
              <button key={filter} type="button" className={filter === 'all' ? 'active' : ''}>
                {filterLabels[filter]}
              </button>
            ))}
          </div>
        </div>

        <div className="project-grid">
          {userProjects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="project-thumbnail" aria-hidden="true">
                {project.thumbnail}
              </div>
              <div className="project-body">
                <span className={`badge ${project.status}`}>{statusLabels[project.status]}</span>
                <h3>{project.title}</h3>
                <p>{typeLabels[project.type]}</p>
                <small>
                  소유자: {project.ownerEmail} · 최근 수정:{' '}
                  {new Intl.DateTimeFormat('ko-KR').format(new Date(project.updatedAt))}
                </small>
              </div>
              <div className="project-actions">
                <Link to={`/projects/${project.id}/photos/upload`}>이어서 편집</Link>
                <button type="button" disabled={project.status !== 'completed'}>
                  다운로드
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
