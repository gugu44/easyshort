import { Link } from 'react-router-dom';

export function PhotoUploadPlaceholderPage() {
  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">다음 단계 · Phase 2/3</p>
        <h1>사진 업로드 플로우 준비</h1>
        <p>
          프로젝트 기반 구축 후 이어서 Supabase Storage, assets 테이블, 사진 3~10장 업로드와 순서 변경을
          구현합니다.
        </p>
      </header>

      <div className="content-card checklist-card">
        <h2>다음 구현 순서</h2>
        <ol>
          <li>Supabase Storage 버킷과 projects/assets 테이블 생성</li>
          <li>드래그 앤 드롭 사진 업로드 및 진행률 표시</li>
          <li>업로드된 사진 썸네일 미리보기와 순서 변경</li>
          <li>직접 대본 작성 화면으로 이동</li>
        </ol>
        <Link to="/dashboard">대시보드로 돌아가기</Link>
      </div>
    </section>
  );
}
