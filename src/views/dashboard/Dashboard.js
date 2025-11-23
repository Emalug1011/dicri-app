import React, { useEffect, useState } from 'react'
import axios from 'axios'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSelect,
  CFormInput,
  CBadge,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import ResumenExpedientes from './ResumenExpedientes'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import ModalAuditoria from '../../components/ModalAuditoria'

import API_URL from "../../api/api";

// Estados definidos
const ESTADOS = [
  { value: '1', label: 'Creados' },
  { value: '2', label: 'En revisión' },
  { value: '3', label: 'Aprobados' },
  { value: '4', label: 'Rechazados' },
]

const getEstadoColor = (id) => {
  switch (Number(id)) {
    case 1: return 'secondary'
    case 2: return 'warning'
    case 3: return 'success'
    case 4: return 'danger'
    default: return 'primary'
  }
}

const Dashboard = () => {
  const [estadoFiltro, setEstadoFiltro] = useState('1')
  const [expedientes, setExpedientes] = useState([])
  const [selectedExpedienteId, setSelectedExpedienteId] = useState(null)
  const [selectedExpediente, setSelectedExpediente] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showAuditoriaModal, setShowAuditoriaModal] = useState(false);
  const [selectedExpedienteCodigo, setSelectedExpedienteCodigo] = useState(null);

  // ⭐ Nuevos estados
  const [fechaInicio, setFechaInicio] = useState('2025-01-01')
  const [fechaFin, setFechaFin] = useState('2025-12-31')

  const token = localStorage.getItem("token")

  // Cargar expedientes con filtro
  const cargarExpedientes = async (estadoValue = estadoFiltro) => {
    try {
      const res = await axios.get(`${API_URL}/expedientes/filter`, {
        params: {
          estado: estadoValue,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        },
        headers: { Authorization: `Bearer ${token}` },
      })

      setExpedientes(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error("Error al cargar expedientes:", error)
      setExpedientes([])
    }
  }

  // Cambiar filtro de estado
  const handleChangeEstado = (e) => {
    const value = e.target.value
    setEstadoFiltro(value)
    cargarExpedientes(value)
  }

  // Cambiar fechas
  const handleFechaChange = () => {
    cargarExpedientes()
  }

  // Abrir Modal Auditoría
  const cargarAuditoria = (id, codigo) => {
    setSelectedExpediente(id);
    setSelectedExpedienteCodigo(codigo);
    setShowAuditoriaModal(true);
  };

  useEffect(() => {
    cargarExpedientes("1")
  }, [])

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <ResumenExpedientes />
        </CCardBody>
      </CCard>



      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Expedientes Registrados</strong>
            </CCardHeader>

            <CCardBody>

              {/*  FILTROS */}
              <CRow className="mb-3">
                {/* Estado */}
                <CCol md={3}>
                  <label className="fw-semibold">Estado</label>
                  <CFormSelect value={estadoFiltro} onChange={handleChangeEstado}>
                    {ESTADOS.map((e) => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </CFormSelect>
                </CCol>

                {/* Fecha Inicio */}
                <CCol md={3}>
                  <label className="fw-semibold">Fecha Inicio</label>
                  <CFormInput
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    onBlur={handleFechaChange}
                  />
                </CCol>

                {/* Fecha Fin */}
                <CCol md={3}>
                  <label className="fw-semibold">Fecha Fin</label>
                  <CFormInput
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    onBlur={handleFechaChange}
                  />
                </CCol>

                {/* Botón Buscar */}
                <CCol md={3} className="d-flex align-items-end">
                  <CButton color="primary" onClick={cargarExpedientes} className="w-100">
                    Buscar
                  </CButton>
                </CCol>
              </CRow>

              {/* TABLA DE EXPEDIENTES */}
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Código</CTableHeaderCell>
                    <CTableHeaderCell>Descripción</CTableHeaderCell>
                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                    <CTableHeaderCell>Usuario creación</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {expedientes.map((exp) => (
                    <CTableRow key={exp.id_expediente}>
                      <CTableDataCell>{exp.codigo_expediente}</CTableDataCell>
                      <CTableDataCell>{exp.descripcion}</CTableDataCell>
                      <CTableDataCell>{new Date(exp.fecha_registro).toLocaleDateString()}</CTableDataCell>
                      <CTableDataCell>{exp.usuario_creacion}</CTableDataCell>

                      <CTableDataCell>
                        <CBadge color={getEstadoColor(exp.id_estado)}>
                          {ESTADOS.find(e => e.value === String(exp.id_estado))?.label}
                        </CBadge>
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {exp.id_estado !== 1 && (
                          <CButton
                            size="sm"
                            color="info"
                            variant="outline"
                            onClick={() => cargarAuditoria(exp.id_expediente, exp.codigo_expediente)}
                          >
                            Ver Auditoría
                          </CButton>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}

                  {expedientes.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan={5} className="text-center text-muted py-4">
                        No hay expedientes en este estado o rango de fechas.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>

          </CCard>
        </CCol>
      </CRow>

      {/* MODAL AUDITORÍA */}
      <ModalAuditoria
        expedienteId={selectedExpediente}
        expedienteCodigo={selectedExpedienteCodigo}
        visible={showAuditoriaModal}
        onClose={() => setShowAuditoriaModal(false)}
      />

    </>
  )
}

export default Dashboard
