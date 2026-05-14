import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { NewProjectPage } from './pages/NewProjectPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PhotoUploadPlaceholderPage } from './pages/PhotoUploadPlaceholderPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="projects/new" element={<NewProjectPage />} />
        <Route path="projects/new/photos/upload" element={<PhotoUploadPlaceholderPage />} />
        <Route path="projects/:projectId/photos/upload" element={<PhotoUploadPlaceholderPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
