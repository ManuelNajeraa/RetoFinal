const usersController = require('../../src/controllers/usersController');
const User = require('../../src/models/User');

jest.mock('../models/User'),

describe('usersController', () => {
  describe('getUsers', () => {
    it('debe obtener todos los usuarios', async () => {
      // Configura el mock para que devuelva datos de prueba
      User.find.mockResolvedValue([{ username: 'testuser1' }, { username: 'testuser2' }]); 

      const req = { query: {} };
      const res = {
        json: jest.fn()
      };

      await usersController.getUsers(req, res);

      expect(res.json).toHaveBeenCalledWith({
        data: [{ username: 'testuser1' }, { username: 'testuser2' }],
        currentPage: 1,
        totalPages: 1
      });
    });

    it('debe manejar errores al obtener usuarios', async () => {
      User.find.mockRejectedValue(new Error('Error de base de datos'));

      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await usersController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error en el servidor' });
    });
  });

  describe('getUserById', () => {
    it('debe obtener un usuario por ID', async () => {
      const testUser = { _id: 'testId', username: 'testuser' };
      User.findById.mockResolvedValue(testUser);

      const req = { params: { id: 'testId' } };
      const res = {
        json: jest.fn()
      };

      await usersController.getUserById(req, res);

      expect(res.json).toHaveBeenCalledWith(testUser);
    });

    it('debe manejar usuario no encontrado', async () => {
      User.findById.mockResolvedValue(null);

      const req = { params: { id: 'testId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await usersController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
    });

    it('debe manejar errores al obtener un usuario por ID', async () => {
      User.findById.mockRejectedValue(new Error('Error de base de datos'));

      const req = { params: { id: 'testId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await usersController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error en el servidor' });
    });
  });

 
});