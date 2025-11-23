import { useState, useEffect } from "react";
import axios from "axios";
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell
} from "@coreui/react";

import API_URL from "../api/api";

export default function ModalAuditoria({ expedienteId, expedienteCodigo, visible, onClose }) {
  const [auditoria, setAuditoria] = useState([]);
  const token = localStorage.getItem("token");

  const cargarAuditoria = async () => {
    if (!expedienteId) return;

    try {
      const res = await axios.get(
        `${API_URL}/expedientes/${expedienteId}/auditoria`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAuditoria(res.data.auditoria);
    } catch (error) {
      console.error("Error cargando auditoría:", error);
    }
  };

  useEffect(() => {
    if (visible) {
      cargarAuditoria();
    } else {
      setAuditoria([]);
    }
  }, [visible, expedienteId]);

  return (
    <CModal visible={visible} onClose={onClose} size="xl">
      <CModalHeader>
        <h5>Historial del expediente {expedienteCodigo}</h5>
      </CModalHeader>

      <CModalBody>
        <CTable striped hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell className="d-none">ID</CTableHeaderCell>
              <CTableHeaderCell>Estado Anterior</CTableHeaderCell>
              <CTableHeaderCell>Estado Nuevo</CTableHeaderCell>
              <CTableHeaderCell>Usuario Responsable</CTableHeaderCell>
              <CTableHeaderCell>Comentario</CTableHeaderCell>
              <CTableHeaderCell>Fecha</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {auditoria.map((a) => (
              <CTableRow key={a.id_auditoria}>
                <CTableDataCell className="d-none">{a.id_auditoria}</CTableDataCell>
                <CTableDataCell>{a.nombre_estado_anterior}</CTableDataCell>
                <CTableDataCell>{a.nombre_estado_nuevo}</CTableDataCell>
                <CTableDataCell>{a.usuario_responsable}</CTableDataCell>
                <CTableDataCell>{a.comentario || "—"}</CTableDataCell>
                <CTableDataCell>{a.fecha_cambio}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
