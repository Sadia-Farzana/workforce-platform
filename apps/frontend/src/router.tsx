import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import EmployeeListPage from '@/pages/employees/EmployeeListPage'
import EmployeeDetailPage from '@/pages/employees/EmployeeDetailPage'
import EmployeeFormPage from '@/pages/employees/EmployeeFormPage'
import ProjectListPage from '@/pages/projects/ProjectListPage'
import ProjectDetailPage from '@/pages/projects/ProjectDetailPage'
import LeavePage from '@/pages/leave/LeavePage'
import { AuditPage, NotFoundPage } from '@/pages/StubPages'
import ProtectedRoute from '@/components/common/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,                    element: <DashboardPage /> },
      { path: 'employees',              element: <EmployeeListPage /> },
      { path: 'employees/new',          element: <EmployeeFormPage /> },
      { path: 'employees/:id',          element: <EmployeeDetailPage /> },
      { path: 'employees/:id/edit',     element: <EmployeeFormPage /> },
      { path: 'projects',               element: <ProjectListPage /> },
      { path: 'projects/:id',           element: <ProjectDetailPage /> },
      { path: 'leave',                  element: <LeavePage /> },
      { path: 'audit',                  element: <AuditPage /> },
      { path: '*',                      element: <NotFoundPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
