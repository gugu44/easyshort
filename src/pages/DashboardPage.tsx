import { Link } from 'react-router-dom';
import { AuthStatus } from '../components/AuthStatus';
import { demoProjects, statusLabels, typeLabels, type ProjectStatus } from '../data/projects';

const filters: Array<'all' | ProjectStatus> = ['all', 'draft', 'rendering', 'completed', 'failed'];

const filterLabels: Record<(typeof filters)[number], string> = {
  all: '전체',
  ...statusLabels,
};

export function DashboardPage() {
  const completedCount = demoProjects.filter((project) => project.status === 'completed').length;

  return (
    <section className="page-stack">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Phase 1 · 프로젝트 기반 구축</p>
          <h1>사진 기반 숏폼 MVP를 시작하세요.</h1>
          <p>
            로드맵의 첫 구현 단계에 맞춰 대시보드, 프로젝트 생성, Supabase 연결 상태를 확인할 수 있는
            기본 워크스페이스를 구성했습니다.
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
          <strong>{demoProjects.length}</strong>
          <small>무료 테스트 프로젝트</small>
        </article>
        <article className="metric-card">
          <span>완료</span>
          <strong>{completedCount}</strong>
          <small>다운로드 가능</small>
        </article>
        <article className="metric-card">
          <span>저장소</span>
          <strong>0.8GB</strong>
          <small>Supabase Storage 예정</small>
        </article>
      </div>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Projects</p>
            <h2>프로젝트 목록</h2>
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
          {demoProjects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="project-thumbnail" aria-hidden="true">
                {project.thumbnail}
              </div>
              <div className="project-body">
                <span className={`badge ${project.status}`}>{statusLabels[project.status]}</span>
                <h3>{project.title}</h3>
                <p>{typeLabels[project.type]}</p>
                <small>최근 수정: {new Intl.DateTimeFormat('ko-KR').format(new Date(project.updatedAt))}</small>
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
