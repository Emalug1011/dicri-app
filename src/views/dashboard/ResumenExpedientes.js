import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
} from '@coreui/react'

import API_URL from "../../api/api";

const colores = {
  Registrado: 'primary',
  'En Revisión': 'info',
  Aprobado: 'success',
  Rechazado: 'danger',
}


const ResumenExpedientes = () => {
  const [resumen, setResumen] = useState([])

  const token = localStorage.getItem('token')

  const cargarResumen = async () => {
    try {
      const res = await axios.get(`${API_URL}/expedientes/resumen`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setResumen(res.data.resumen)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    cargarResumen()
  }, [])

  return (
    <CRow>
      {resumen.map((item) => (
        <CCol sm={6} lg={3} key={item.id_estado}>
          <CCard className={`text-white bg-${colores[item.nombre_estado]} mb-3`} style={{ cursor: 'pointer' }}>
            <CCardBody>
              <div className="text-medium-emphasis-inverse small">{item.nombre_estado}</div>
              <div className="fs-4 fw-bold">{item.total_expedientes}</div>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  )
}

export default ResumenExpedientes
