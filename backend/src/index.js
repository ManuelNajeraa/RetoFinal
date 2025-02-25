require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const mongoose = require('mongoose'); // Importa mongoose
const { page, limit, filter } = req.query;


// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/tu_base_de_datos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Datos de usuarios simulados
const users = [
  { id: 1, username: 'admin', password: 'admin', roles: ['admin'] },
  { id: 2, username: 'user', password: 'user', roles: ['user'] },
];

// Roles y permisos
const roles = {
  admin: ['leer-todos-los-datos', 'crear-usuario', 'editar-usuario', 'eliminar-usuario'],
  usuario: ['leer-datos-propios', 'editar-perfil'],
};

// Datos simulados para las rutas GET
const data = [
  { id: 1, name: 'Dato 1', userId: 1 },
  { id: 2, name: 'Dato 2', userId: 1 },
  { id: 3, name: 'Dato 3', userId: 2 },
  { id: 4, name: 'Dato 4', userId: 2 },
];

// Función para generar un token JWT
function generateToken(user) {
  return jwt.sign({ userId: user.id, roles: user.roles }, process.env.JWT_SECRET);
}

// Middleware para verificar un token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ');

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Middleware para verificar permisos
function authorizePermission(permission) {
  return (req, res, next) => {
    if (!req.user.roles.some(role => roles[role].includes(permission))) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }
    next();
  };
}

// Ruta de inicio de sesión
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Autenticación simulada
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = generateToken(user);
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

// Ruta para obtener todos los datos con filtros y paginación
app.get('/api/data', authenticateToken, authorizePermission('leer-todos-los-datos'), (req, res) => {
  const { page, limit, filter } = req.query;

  // Filtrado
  let filteredData = data;
  if (filter) {
    filteredData = filteredData.filter(item => item.name.includes(filter));
  }

  // Paginación
   page = parseInt(req.query.page) || 1;
   limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  res.json({
    data: paginatedData,
    currentPage: page,
    totalPages: Math.ceil(filteredData.length / limit),
  });
});

// Ruta para obtener los datos del perfil del usuario con filtros y paginación
app.get('/api/profile', authenticateToken, authorizePermission('leer-datos-propios'), (req, res) => {
  const { page, limit, filter } = req.query;

  // Filtrado
  let filteredData = data.filter(item => item.userId === req.user.userId);
  if (filter) {
    filteredData = filteredData.filter(item => item.name.includes(filter));
  }

  // Paginación
   page = parseInt(req.query.page) || 1;
   limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  res.json({
    data: paginatedData,
    currentPage: page,
    totalPages: Math.ceil(filteredData.length / limit),
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});