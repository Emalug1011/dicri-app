import React from 'react'

// Views principales
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Expedientes = React.lazy(() => import('./views/expedientes/Expedientes'))
const CrearExpediente = React.lazy(() => import('./views/expedientes/CrearExpediente'))
const Aprobaciones = React.lazy(() => import('./views/aprobaciones/Aprobaciones'))
const Usuarios = React.lazy(() => import('./views/usuarios/Usuarios'))
const Reportes = React.lazy(() => import('./views/reportes/Reportes'))

const routes = [
  { path: '/', exact: true, name: 'Home' },

  // Dashboard (todos los roles)
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // Mis Expedientes (Técnico, Coordinador, Admin)
  { path: '/expedientes', name: 'Mis Expedientes', element: Expedientes },

  // Crear Expediente (Técnico, Admin)
  { path: '/expedientes/nuevo', name: 'Crear Expediente', element: CrearExpediente },

  // Aprobaciones (Coordinador, Admin)
  { path: '/aprobaciones', name: 'Aprobaciones', element: Aprobaciones },

  // Usuarios (Admin)
  { path: '/usuarios', name: 'Usuarios', element: Usuarios },

  // Reportes (Admin)
  { path: '/reportes', name: 'Reportes', element: Reportes },
]

export default routes
