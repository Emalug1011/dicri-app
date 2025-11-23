export const logout = () => {
    // Eliminar token y usuario
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("usuario");
  
    // Redirigir a login
    window.location.href = "/#/login";  // ← CoreUI usa hash router
  };
  