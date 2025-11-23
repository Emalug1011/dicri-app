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

// 🔍 Obtener rol del token
function getUserRole() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.rol || null;
  } catch (e) {
    console.error("Error leyendo token:", e);
    return null;
  }
}

export default function ModalIndicios({ expedienteId, expedienteCodigo, visible, onClose }) {
  const [indicios, setIndicios] = useState([]);
  const token = localStorage.getItem("token");

  const rolUsuario = getUserRole(); // 👈 Saber si es Técnico

  const cargarIndicios = async () => {
    if (!expedienteId) return;

    try {
      const res = await axios.get(
        `${API_URL}/expedientes/${expedienteId}/indicios`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIndicios(res.data.indicios);
    } catch (error) {
      console.error("Error cargando indicios:", error);
    }
  };

  useEffect(() => {
    if (visible) {
      cargarIndicios();
    } else {
      setIndicios([]);
    }
  }, [visible, expedienteId]);

  const darDeBaja = async (id_indicio) => {
    try {
      await axios.put(
        `${API_URL}/indicios/${id_indicio}/estado`,
        { estado: 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      cargarIndicios();
    } catch (error) {
      console.error("Error dando de baja indicio:", error);
    }
  };

  return (
    <CModal visible={visible} onClose={onClose} size="xl">
      <CModalHeader>
        <h5>Indicios del expediente {expedienteCodigo}</h5>
      </CModalHeader>

      <CModalBody>
        <CTable striped hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell className="d-none">ID</CTableHeaderCell>
              <CTableHeaderCell>Descripción</CTableHeaderCell>
              <CTableHeaderCell>Color</CTableHeaderCell>
              <CTableHeaderCell>Tamaño</CTableHeaderCell>
              <CTableHeaderCell>Peso</CTableHeaderCell>
              <CTableHeaderCell>Ubicación</CTableHeaderCell>
              <CTableHeaderCell>Estado</CTableHeaderCell>

              {/* Solo Técnicos ven Acciones */}
              {rolUsuario === "Tecnico" && (
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              )}
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {indicios.map((i) => (
              <CTableRow key={i.id_indicio}>
                <CTableDataCell className="d-none">{i.id_indicio}</CTableDataCell>
                <CTableDataCell>{i.descripcion}</CTableDataCell>
                <CTableDataCell>{i.color}</CTableDataCell>
                <CTableDataCell>{i.tamano}</CTableDataCell>
                <CTableDataCell>{i.peso}</CTableDataCell>
                <CTableDataCell>{i.ubicacion}</CTableDataCell>

                <CTableDataCell>
                  {i.estado === 1 ? (
                    <span className="badge bg-success">Activo</span>
                  ) : (
                    <span className="badge bg-danger">Baja</span>
                  )}
                </CTableDataCell>

                {/* Acciones SOLO para Técnicos */}
                {rolUsuario === "Tecnico" && (
                  <CTableDataCell>
                    {i.estado === 1 && (
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => darDeBaja(i.id_indicio)}
                      >
                        Dar de baja
                      </CButton>
                    )}
                  </CTableDataCell>
                )}
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
