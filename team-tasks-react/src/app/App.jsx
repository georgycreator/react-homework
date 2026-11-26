import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from '../components/AppLayout'
import { LoadingState } from '../components/LoadingState'
import { UsersPage } from '../pages/UsersPage'
import { UserLayout } from '../pages/UserLayout'
import { UserProfilePage } from '../pages/UserProfilePage'
import { UserTasksPage } from '../pages/UserTasksPage'
import { FavoritesPage } from '../pages/FavoritesPage'
import { NotFoundPage } from '../pages/NotFoundPage'

const TaskPage = lazy(() => import('../pages/TaskPage'))

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/users" replace />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:userId" element={<UserLayout />}>
          <Route index element={<UserProfilePage />} />
          <Route path="tasks" element={<UserTasksPage />} />
        </Route>
        <Route
          path="tasks/:taskId"
          element={(
            <Suspense fallback={<LoadingState>Загружаем страницу задачи…</LoadingState>}>
              <TaskPage />
            </Suspense>
          )}
        />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
