export const getUsuario = () => {
    const user = localStorage.getItem("usuario");
    return user ? JSON.parse(user) : null;
  };
  
  export const getRol = () => {
    const user = getUsuario();
    console.log(getUsuario());
    return user ? user.rol : null;
  };
  