import { Navigate, Route, Routes } from 'react-router-dom'

import Layout from './components/layout/Layout.jsx'
import StudentsPage from './features/students/StudentsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/students" replace />} />
        <Route path="students" element={<StudentsPage />} />
        {/* New pages (courses, attendance, ...) will be added here */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
