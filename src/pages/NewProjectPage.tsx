import { Link } from 'react-router-dom';
import { projectTypeOptions } from '../data/projects';

export function NewProjectPage() {
  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">새 프로젝트 선택</p>
        <h1>어떤 방식으로 숏폼을 만들까요?</h1>
        <p>로그인한 사용자 워크스페이스에 새 프로젝트를 만들고, MVP에서는 사진 기반 숏폼 제작만 활성화합니다.</p>
      </header>

      <div className="option-grid">
        {projectTypeOptions.map((option) => (
          <article className={option.enabled ? 'option-card enabled' : 'option-card'} key={option.id}>
            <div>
              <span className="badge">{option.enabled ? 'MVP 활성화' : '준비 중'}</span>
              <h2>{option.title}</h2>
              <p>{option.description}</p>
            </div>
            {option.enabled ? (
              <Link className="primary-button" to="/projects/new/photos/upload">
                시작하기
              </Link>
            ) : (
              <button type="button" disabled>
                준비 중
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
