export const PERMISOS = {
    Tecnico: {
      bandeja: true,
      crearExpediente: false,
      agregarIndicios: true,
      aprobar: false,
      rechazar: false,
      reportes: false,
      usuarios: false,
    },
    Coordinador: {
      bandeja: false,
      crearExpediente: false,
      agregarIndicios: false,
      aprobar: true,
      rechazar: false,
      reportes: false,
      usuarios: false,
    },
    Administrador: {
      bandeja: false,
      crearExpediente: false,
      agregarIndicios: false,
      aprobar: false,
      rechazar: false,
      reportes: true,
      usuarios: true,
    },
  };
  