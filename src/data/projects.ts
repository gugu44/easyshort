export type ProjectStatus = 'draft' | 'rendering' | 'completed' | 'failed';

export type Project = {
  id: string;
  title: string;
  type: 'photo_to_short' | 'long_to_short' | 'short_rework' | 'video_edit' | 'script_to_short';
  status: ProjectStatus;
  updatedAt: string;
  thumbnail: string;
  ownerEmail: string;
  usedStorageMb: number;
};

export const statusLabels: Record<ProjectStatus, string> = {
  draft: '작성 중',
  rendering: '렌더링 중',
  completed: '완료',
  failed: '실패',
};

export const typeLabels: Record<Project['type'], string> = {
  photo_to_short: '사진으로 숏폼 만들기',
  long_to_short: '롱폼 영상으로 숏폼 만들기',
  short_rework: '기존 숏폼 재가공',
  video_edit: '일반 영상 편집',
  script_to_short: '대본으로 숏폼 만들기',
};

export const demoProjects: Project[] = [
  {
    id: 'demo-photo-001',
    title: '카페 신메뉴 30초 홍보',
    type: 'photo_to_short',
    status: 'draft',
    updatedAt: '2026-05-14T09:30:00.000Z',
    thumbnail: '☕',
    ownerEmail: 'you@example.com',
    usedStorageMb: 180,
  },
  {
    id: 'demo-photo-002',
    title: '봄 여행 코스 추천',
    type: 'photo_to_short',
    status: 'rendering',
    updatedAt: '2026-05-13T15:10:00.000Z',
    thumbnail: '🌸',
    ownerEmail: 'you@example.com',
    usedStorageMb: 420,
  },
  {
    id: 'demo-photo-003',
    title: '홈트 루틴 요약',
    type: 'photo_to_short',
    status: 'completed',
    updatedAt: '2026-05-12T21:45:00.000Z',
    thumbnail: '💪',
    ownerEmail: 'you@example.com',
    usedStorageMb: 230,
  },
];

export const projectTypeOptions = [
  {
    id: 'long_to_short',
    title: typeLabels.long_to_short,
    description: '긴 영상에서 하이라이트 구간을 찾아 세로 숏폼으로 변환합니다.',
    enabled: false,
  },
  {
    id: 'short_rework',
    title: typeLabels.short_rework,
    description: '기존 숏폼의 자막, 후킹 문구, 음성을 새 버전으로 재가공합니다.',
    enabled: false,
  },
  {
    id: 'photo_to_short',
    title: typeLabels.photo_to_short,
    description: '사진 3~10장과 대본을 조합해 9:16 숏폼을 제작합니다.',
    enabled: true,
  },
  {
    id: 'video_edit',
    title: typeLabels.video_edit,
    description: '일반 영상을 업로드하고 구간, 크롭, 자막을 편집합니다.',
    enabled: false,
  },
  {
    id: 'script_to_short',
    title: typeLabels.script_to_short,
    description: '대본을 먼저 작성한 뒤 이미지/음성 소재를 붙여 숏폼을 만듭니다.',
    enabled: false,
  },
] as const;


export const currentUserPlan = {
  name: 'Free',
  monthlyProjectLimit: 10,
  storageLimitMb: 1024,
  renderCreditLimit: 30,
};

export function getProjectsForUser(userEmail: string | null) {
  return demoProjects.map((project) => ({
    ...project,
    ownerEmail: userEmail ?? project.ownerEmail,
  }));
}
