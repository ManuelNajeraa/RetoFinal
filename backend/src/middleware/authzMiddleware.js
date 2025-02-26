// Roles y permisos
const roles = {
    admin: ['leer-todos-los-datos', 'crear-usuario', 'editar-usuario', 'eliminar-usuario', 'leer-datos-api-externa'],
    usuario: ['leer-datos-propios', 'editar-perfil'],
  };
  
  // Middleware para verificar permisos
  function authorizePermission(permission) {
    return (req, res, next) => {
      if (!req.user || !req.user.roles.some(role => roles[role].includes(permission))) {
        return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
      }
      next();
    };
  }
  
  module.exports = authorizePermission;