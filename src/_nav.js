import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilFolder,
  cilCheckCircle,
  cilUser,
  cilChartPie,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

import { getRol } from './utils/auth'
import { PERMISOS } from './utils/permisos'

const buildNav = () => {
  const rol = getRol()
  const permisos = PERMISOS[rol] || {}

  return [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    permisos.bandeja && {
      component: CNavItem,
      name: 'Mis Expedientes',
      to: '/expedientes',
      icon: <CIcon icon={cilFolder} customClassName="nav-icon" />,
    },
    permisos.crearExpediente && {
      component: CNavItem,
      name: 'Crear Expediente',
      to: '/expedientes/nuevo',
      icon: <CIcon icon={cilFolder} customClassName="nav-icon" />,
    },
    permisos.aprobar && {
      component: CNavItem,
      name: 'Aprobaciones',
      to: '/aprobaciones',
      icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
    },
    permisos.reportes && {
      component: CNavItem,
      name: 'Reportes',
      to: '/reportes',
      icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    },
    permisos.usuarios && {
      component: CNavItem,
      name: 'Usuarios',
      to: '/usuarios',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
  ].filter(Boolean)
}

// EXPORTAR MENÚ DINÁMICO
const _nav = buildNav()
export default _nav
