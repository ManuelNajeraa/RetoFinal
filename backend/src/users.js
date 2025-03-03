const express = require('express');
const router = express.Router();
const usersController = require('./controllers/usersController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizePermission = require('../middleware/authzMiddleware');

// Define las rutas para cada operación CRUD
router.get('/', authenticateToken, authorizePermission('leer-todos-los-datos'), usersController.getUsers);
router.get('/:id', authenticateToken, authorizePermission('leer-datos-propios'), usersController.getUserById);
router.post('/', authenticateToken, authorizePermission('crear-usuario'), usersController.createUser);
router.put('/:id', authenticateToken, authorizePermission('editar-usuario'), usersController.updateUser);
router.delete('/:id', authenticateToken, authorizePermission('eliminar-usuario'), usersController.deleteUser);

module.exports = router; 