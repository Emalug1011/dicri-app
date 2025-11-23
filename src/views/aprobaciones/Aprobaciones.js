import React, { useEffect, useState } from 'react'
import {
    CBadge,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CFormInput,
    CFormLabel,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'


// 🔵 Íconos
import CIcon from '@coreui/icons-react'
import { cilSearch, cilReload, cilHistory } from '@coreui/icons'
import ModalIndicios from '../../components/ModalIndicios'
import ModalAuditoria from "../../components/ModalAuditoria";

import alertify from 'alertifyjs';

import API_URL from "../../api/api";

// 🔵 Color del estado
const getEstadoColor = (estado) => {
    switch (estado) {
        case 'Registrado':
            return 'info'
        case 'En Revisión':
            return 'warning'
        case 'Aprobado':
            return 'success'
        case 'Rechazado':
            return 'danger'
        default:
            return 'secondary'
    }
}

const Expedientes = () => {
    const [expedientes, setExpedientes] = useState([])
    const [loading, setLoading] = useState(true)

    const [showEstadoModal, setShowEstadoModal] = useState(false)
    const [comentario, setComentario] = useState('')
    const [nuevoEstado, setNuevoEstado] = useState(3)

    const [modalVisible, setModalVisible] = useState(false)
    const [showAuditoriaModal, setShowAuditoriaModal] = useState(false)

    const [selectedExpediente, setSelectedExpediente] = useState(null)
    const [selectedExpedienteCodigo, setSelectedExpedienteCodigo] = useState(null)


    const token = localStorage.getItem('token')

    // ============================================================
    // Cargar expedientes
    // ============================================================
    const loadExpedientes = async () => {
        setLoading(true)

        try {
            const res = await fetch(`${API_URL}/expedientes/mis-expedientes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await res.json()

            if (data.expedientes) {
                setExpedientes(data.expedientes)
            }
        } catch (error) {
            alertify.error('Error cargando expedientes')
        }

        setLoading(false)
    }

    useEffect(() => {
        loadExpedientes()
    }, [])

    // ============================================================
    // 🔶 Cambiar estado
    // ============================================================
    const cambiarEstado = async () => {

        if (nuevoEstado === 4 && !comentario.trim()) {
          return alertify.error("Debe ingresar un motivo para rechazar el expediente");
        }
      
        try {
          const res = await fetch(
            `${API_URL}/expedientes/${selectedExpediente}/estado`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                id_estado_nuevo: nuevoEstado,
                comentario,
              }),
            }
          );
      
          const data = await res.json();
      
          if (res.ok) {
            alertify.success(
              nuevoEstado === 3
                ? "Expediente aprobado"
                : "Expediente rechazado"
            );
            setShowEstadoModal(false);
            loadExpedientes();
          } else {
            alertify.error(data.message || "No se pudo cambiar el estado");
          }
        } catch (error) {
          alertify.error("Error de conexión con el servidor");
        }
      };
      

    const abrirModalIndicios = (id, codigo) => {
        setSelectedExpediente(id);
        setSelectedExpedienteCodigo(codigo);
        setModalVisible(true);
    };

    const abrirModalAuditoria = (id, codigo) => {
        setSelectedExpediente(id);
        setSelectedExpedienteCodigo(codigo);
        setShowAuditoriaModal(true);
    };

    return (
        <CCard>
            <CCardHeader>
                <h5>Expedientes disponibles para verificación</h5>
            </CCardHeader>

            <CCardBody>
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <>
                        {/* ========================================= */}
                        {/* 🔵 Tabla de expedientes */}
                        {/* ========================================= */}
                        <CTable hover>
                            <CTableHead color="primary">
                                <CTableRow>
                                    <CTableHeaderCell className="d-none">ID</CTableHeaderCell>
                                    <CTableHeaderCell>Código</CTableHeaderCell>
                                    <CTableHeaderCell>Descripción</CTableHeaderCell>
                                    <CTableHeaderCell>Estado</CTableHeaderCell>
                                    <CTableHeaderCell>Registro</CTableHeaderCell>
                                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>

                            <CTableBody>
                                {expedientes.map((exp) => (
                                    <CTableRow key={exp.id_expediente}>
                                        <CTableDataCell className="d-none">{exp.id_expediente}</CTableDataCell>

                                        <CTableDataCell>{exp.codigo_expediente}</CTableDataCell>
                                        <CTableDataCell>{exp.descripcion}</CTableDataCell>

                                        <CTableDataCell>
                                            <CBadge color={getEstadoColor(exp.nombre_estado)}>
                                                {exp.nombre_estado}
                                            </CBadge>
                                        </CTableDataCell>

                                        <CTableDataCell>{exp.fecha_registro}</CTableDataCell>

                                        <CTableDataCell>

                                            <CButton
                                                size="sm"
                                                color="warning"
                                                className="me-2"
                                                title="Operar"
                                                onClick={() => {
                                                    setSelectedExpediente(exp.id_expediente)
                                                    setShowEstadoModal(true)
                                                }}
                                            >
                                                <CIcon icon={cilReload} />
                                            </CButton>

                                            {/* Ver indicios */}
                                            <CButton
                                                size="sm"
                                                color="secondary"
                                                className="me-2"
                                                title="Ver indicios"
                                                onClick={() =>
                                                    abrirModalIndicios(exp.id_expediente, exp.codigo_expediente)
                                                }
                                            >
                                                <CIcon icon={cilSearch} />
                                            </CButton>

                                            {/* Ver historial */}
                                            <CButton
                                                size="sm"
                                                color="danger"
                                                title="Ver historial"
                                                onClick={() =>
                                                    abrirModalAuditoria(exp.id_expediente, exp.codigo_expediente)
                                                }
                                            >
                                                <CIcon icon={cilHistory} />
                                            </CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </>
                )}
            </CCardBody>

            {/* ===================================================== */}
            {/* MODAL ✔ CAMBIAR ESTADO */}
            {/* ===================================================== */}
            <CModal visible={showEstadoModal} onClose={() => setShowEstadoModal(false)}>
                <CModalHeader>Cambiar estado del expediente</CModalHeader>

                <CModalBody>
                    <CFormLabel>Seleccione el nuevo estado del expediente</CFormLabel>

                    <select
                        className="form-select"
                        value={nuevoEstado}
                        onChange={(e) => setNuevoEstado(parseInt(e.target.value))}
                    >
                        <option value="3">Aprobado</option>
                        <option value="4">Rechazado</option>
                    </select>

                    {/* Campo comentario solo si es rechazo */}
                    {nuevoEstado === 4 && (
                        <>
                            <CFormLabel className="mt-3">Motivo del rechazo</CFormLabel>
                            <CFormInput
                                placeholder="Ingrese el motivo del rechazo"
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                            />
                        </>
                    )}
                </CModalBody>

                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowEstadoModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="primary" onClick={cambiarEstado}>
                        Guardar
                    </CButton>
                </CModalFooter>
            </CModal>


            {/* ===================================================== */}
            {/* MODAL ✔ VER INDICIOS (componentizado) */}
            {/* ===================================================== */}
            <ModalIndicios
                expedienteId={selectedExpediente}
                expedienteCodigo={selectedExpedienteCodigo}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />

            {/* ===================================================== */}
            {/* MODAL ✔ HISTORIAL */}
            {/* ===================================================== */}
            <ModalAuditoria
                expedienteId={selectedExpediente}
                expedienteCodigo={selectedExpedienteCodigo}
                visible={showAuditoriaModal}
                onClose={() => setShowAuditoriaModal(false)}
            />

        </CCard>
    )
}

export default Expedientes
