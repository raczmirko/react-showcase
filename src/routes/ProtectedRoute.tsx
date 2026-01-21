import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext, type Role } from '../app/providers/AuthProvider'

export function ProtectedRoute({ requiredRole }: { requiredRole?: Role }) {
  const { user } = React.useContext(AuthContext)

  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/access-denied" replace />

  return <Outlet />
}