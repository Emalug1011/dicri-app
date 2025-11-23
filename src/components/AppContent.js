import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import routes from '../routes'
import PrivateRoute from '../utils/PrivateRoute'

const AppContent = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        {routes.map((route, idx) => {
          const Component = route.element
          return (
            Component && (
              <Route
                key={idx}
                path={route.path}
                element={
                  <PrivateRoute>
                    <Component />
                  </PrivateRoute>
                }
              />
            )
          )
        })}

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Suspense>
  )
}

export default AppContent
