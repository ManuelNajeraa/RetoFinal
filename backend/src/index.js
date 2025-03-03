require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const mongoose = require('mongoose');
const axios = require('axios'); // Importa axios para la API externa
const usersRouter = require('backend/src/users.js'); // Importa el enrutador de usuarios


// Conexión a MongoDB (corregida la URL)
mongoose.connect('mongodb+srv://Ger4:1234@cluster1.h0erm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
}
)
console.log('Conexion exitosa')
;

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
  admin: ['leer-todos-los-datos', 'crear-usuario', 'editar-usuario', 'eliminar-usuario', 'leer-datos-api-externa'],
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
    if (!req.user || !req.user.roles.some(role => roles[role].includes(permission))) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }
    next();
  };
}

// Ruta de Registro
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validación de datos
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // 2. Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    // 3. Hashear la contraseña (opcional, pero recomendado)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Crear el nuevo usuario
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    // 5. Generar un token JWT (opcional)
    const token = generateToken(newUser);

    // 6. Enviar la respuesta
    res.status(201).json({ 
      message: 'Usuario creado correctamente', 
      user: newUser, 
      token: token  // Si generaste un token
    });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

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

// Monta el enrutador de usuarios en /api/users
app.use('/api/users', usersRouter);

// Ruta para obtener todos los datos con filtros y paginación
app.get('/api/data', authenticateToken, authorizePermission('leer-todos-los-datos'), (req, res) => {
  let { page, limit, filter } = req.query;

  // Filtrado
  let filteredData = data;
  if (filter) {
    filteredData = filteredData.filter(item => item.name.includes(filter));
  }

  // Paginación
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
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
  let { page, limit, filter } = req.query;

  // Filtrado
  let filteredData = data.filter(item => item.userId === req.user.userId);
  if (filter) {
    filteredData = filteredData.filter(item => item.name.includes(filter));
  }

  // Paginación
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  res.json({
    data: paginatedData,
    currentPage: page,
    totalPages: Math.ceil(filteredData.length / limit),
  });
});

// Ruta para obtener datos de una API externa 
app.get('/api/external-data', authenticateToken, authorizePermission('leer-datos-api-externa'), async (req, res) => {
  try {
    const response = await axios.get('https://www.figma.com/design/0GvUxHGxMoPoSvxnLuKEYL/Untitled?node-id=0-1&t=Q5lHwH9uYEY1lPfj-1'); 
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener datos de la API externa:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});