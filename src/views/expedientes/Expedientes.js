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
import { cilSearch, cilReload, cilPlus , cilHistory  } from '@coreui/icons'
import ModalIndicios from '../../components/ModalIndicios'
import ModalAuditoria from "../../components/ModalAuditoria";

import alertify from 'alertifyjs';

import API_URL from "../../api/api.js";


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

    const [showIndicioModal, setShowIndicioModal] = useState(false)
    const [selectedExpedienteId, setSelectedExpedienteId] = useState(null)

    const [nuevaDescripcion, setNuevaDescripcion] = useState("");
    const [creating, setCreating] = useState(false);

    const [showAuditoriaModal, setShowAuditoriaModal] = useState(false);
    
    

    const [indicio, setIndicio] = useState({
        descripcion: '',
        color: '',
        tamano: '',
        peso: '',
        ubicacion: '',
    })

    const [showEstadoModal, setShowEstadoModal] = useState(false)
    const [nuevoEstado, setNuevoEstado] = useState(2)
    const [comentario, setComentario] = useState('')

    // 🔵 Modal para VER indicios
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedExpediente, setSelectedExpediente] = useState(null)
    const [selectedExpedienteCodigo, setSelectedExpedienteCodigo] = useState(null);


    const token = localStorage.getItem('token')

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
      

    const crearExpediente = async () => {
        if (!nuevaDescripcion.trim()) {
            alert("Debe ingresar una descripción");
            return;
        }

        setCreating(true);

        try {
            const res = await fetch(`${API_URL}/expedientes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    descripcion: nuevaDescripcion,
                }),
            });

            if (res.ok) {
                alertify.success("Expediente creado correctamente");
                setNuevaDescripcion("");
                loadExpedientes();
            } else {
                alertify.error("Error creando expediente");
            }
        } catch (error) {
            console.error("Error:", error);
        }

        setCreating(false);
    };



    // ============================================================
    //  Cargar expedientes
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
            alertify.error('Error cargando expedientes:', error)
        }

        setLoading(false)
    }

    useEffect(() => {
        loadExpedientes()
    }, [])

    // ============================================================
    // 🔵 Agregar indicio
    // ============================================================
    const agregarIndicio = async () => {
        try {
            const res = await fetch(
                `${API_URL}/expedientes/${selectedExpedienteId}/indicios`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(indicio),
                },
            )

            if (res.ok) {
                alertify.success('Indicio agregado correctamente')
                setShowIndicioModal(false)

                setIndicio({ descripcion: '', color: '', tamano: '', peso: '', ubicacion: '' })
            }
        } catch (error) {
            alertify.error('Error agregando indicio:', error)
        }
    }

    // ============================================================
    // 🔶 Cambiar estado
    // ============================================================
    const cambiarEstado = async () => {
        try {
            const res = await fetch(
                `${API_URL}/expedientes/${selectedExpedienteId}/estado`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        id_estado_nuevo: 2,
                        comentario,
                    }),
                },
            );

            // 🔥 Leer respuesta del backend (éxito o error)
            const data = await res.json();

            if (res.ok) {
                alertify.success('Estado actualizado correctamente');
                setShowEstadoModal(false);
                loadExpedientes();
            } else {

                alertify.error(data.error || 'Error cambiando estado');
            }
        } catch (error) {
            alertify.error('Error de conexión con el servidor');

        }
    };


    return (
        <CCard>
            <CCardHeader>
                <h5>Mis Expedientes</h5>
            </CCardHeader>



            <CCardBody>
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <>
                        {/* ========================================= */}
                        {/* 🔵 Crear nuevo expediente */}
                        {/* ========================================= */}
                        <div className="mb-4 p-3 border rounded">
                            <h6>Crear nuevo expediente</h6>


                            <CFormInput
                                placeholder="Ingrese la descripción del expediente..."
                                value={nuevaDescripcion}
                                onChange={(e) => setNuevaDescripcion(e.target.value)}
                            />

                            <CButton
                                color="primary"
                                className="mt-3"
                                disabled={creating}
                                onClick={crearExpediente}
                            >
                                {creating ? "Creando..." : "Crear expediente"}
                            </CButton>
                        </div>

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
                                        <CTableDataCell className="d-none">
                                            {exp.id_expediente}
                                        </CTableDataCell>

                                        <CTableDataCell>{exp.codigo_expediente}</CTableDataCell>
                                        <CTableDataCell>{exp.descripcion}</CTableDataCell>

                                        <CTableDataCell>
                                            <CBadge color={getEstadoColor(exp.nombre_estado)}>
                                                {exp.nombre_estado}
                                            </CBadge>
                                        </CTableDataCell>

                                        <CTableDataCell>{exp.fecha_registro}</CTableDataCell>

                                        <CTableDataCell>
                                            {/* Agregar indicio */}
                                            <CButton
                                                size="sm"
                                                color="success"
                                                className="me-2"
                                                title="Agregar Indicio"
                                                onClick={() => {
                                                    setSelectedExpedienteId(exp.id_expediente)
                                                    setShowIndicioModal(true)
                                                }}
                                            >
                                                <CIcon icon={cilPlus} />
                                            </CButton>

                                            {/* Enviar a revisión */}
                                            <CButton
                                                size="sm"
                                                color="warning"
                                                className="me-2"
                                                title="Enviar a Revisión"
                                                onClick={() => {
                                                    setSelectedExpedienteId(exp.id_expediente)
                                                    setShowEstadoModal(true)
                                                }}
                                            >
                                                <CIcon icon={cilReload} />
                                            </CButton>

                                            {/* Ver indicios */}
                                            <CButton
                                                size="sm"
                                                color="secondary"
                                                title="Ver indicios"
                                                onClick={() => abrirModalIndicios(exp.id_expediente, exp.codigo_expediente)}
                                            >
                                                <CIcon icon={cilSearch} />
                                            </CButton>

                                            <CButton
                                                size="sm"
                                                color="danger"
                                                className="ms-2"
                                                title="Ver historial"
                                                onClick={() => abrirModalAuditoria(exp.id_expediente, exp.codigo_expediente)}
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
            {/* MODAL ✔ AGREGAR INDICIO */}
            {/* ===================================================== */}
            <CModal visible={showIndicioModal} onClose={() => setShowIndicioModal(false)}>
                <CModalHeader>Agregar Indicio</CModalHeader>
                <CModalBody>
                    <CFormLabel>Descripción</CFormLabel>
                    <CFormInput
                        value={indicio.descripcion}
                        onChange={(e) => setIndicio({ ...indicio, descripcion: e.target.value })}
                    />

                    <CFormLabel className="mt-2">Color</CFormLabel>
                    <CFormInput
                        value={indicio.color}
                        onChange={(e) => setIndicio({ ...indicio, color: e.target.value })}
                    />

                    <CFormLabel className="mt-2">Tamaño</CFormLabel>
                    <CFormInput
                        value={indicio.tamano}
                        onChange={(e) => setIndicio({ ...indicio, tamano: e.target.value })}
                    />

                    <CFormLabel className="mt-2">Peso</CFormLabel>
                    <CFormInput
                        value={indicio.peso}
                        onChange={(e) => setIndicio({ ...indicio, peso: e.target.value })}
                    />

                    <CFormLabel className="mt-2">Ubicación</CFormLabel>
                    <CFormInput
                        value={indicio.ubicacion}
                        onChange={(e) => setIndicio({ ...indicio, ubicacion: e.target.value })}
                    />
                </CModalBody>

                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowIndicioModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="primary" onClick={agregarIndicio}>
                        Guardar
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* ===================================================== */}
            {/* MODAL ✔ CAMBIAR ESTADO */}
            {/* ===================================================== */}
            <CModal visible={showEstadoModal} onClose={() => setShowEstadoModal(false)}>
                <CModalHeader>
                    Esta seguro que desea enviar el expediente al coordinador?
                </CModalHeader>

                <CModalBody>
                    <CFormLabel>Comentario</CFormLabel>
                    <CFormInput
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                    />
                </CModalBody>

                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowEstadoModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="warning" onClick={cambiarEstado}>
                        Enviar
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
            {/* MODAL HISTORIAL (componentizado) */}
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
