import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilLockLocked } from '@coreui/icons'
import api from '../../../api/axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [usuario, setUsuario] = useState('')
  const [contrasenia, setContrasenia] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await api.post('/auth/login', {
        usuario,
        contrasenia,
      })

      // Token recibido
      const { token } = response.data

      // Guardar token
      localStorage.setItem('token', token)
      localStorage.setItem("auth_token", token); 
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));

      // Redirigir al dashboard
      navigate('/dashboard')

    } catch (err) {
      console.error(err)
      setError("Usuario o contraseña incorrectos")
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Ingresa a tu cuenta</p>

                    {error && (
                      <div className="text-danger mb-2">{error}</div>
                    )}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Usuario"
                        autoComplete="username"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={contrasenia}
                        onChange={(e) => setContrasenia(e.target.value)}
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          type="submit"
                          className="px-4 text-white"
                          style={{ backgroundColor: '#4C76B8', borderColor: '#4C76B8' }}
                        >
                          Login
                        </CButton>

                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

              <CCard
                className="text-dark py-5"
                style={{
                  width: '44%',
                  backgroundColor: '#4C76B8', // Azul claro institucional del MP
                }}
              >
                <CCardBody className="text-center text-white">
                  <h2 className="text-white">DICRI</h2>
                  <p className="text-white">
                    Sistema de Gestión de Expedientes e Indicios. Facilita el registro,
                    revisión y aprobación de información para apoyar procesos de investigación.
                  </p>
                </CCardBody>
              </CCard>



            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
