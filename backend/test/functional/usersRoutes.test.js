const request = require('supertest');
const app = require('../../src/index');
const User = require('../src/models/User'); 
jest.mock('../src/models/User'),


describe('Rutas de usuarios', () => {
  describe('GET /api/users', () => {
    it('debe obtener una lista de usuarios', async () => {
      // Configura el mock para que devuelva datos de prueba
      User.find.mockResolvedValue([{ username: 'testuser1' }, { username: 'testuser2' }]); 

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer <token_valido>'); // Reemplaza con un token válido

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
    });

    it('debe manejar errores al obtener usuarios', async () => {
      User.find.mockRejectedValue(new Error('Error de base de datos'));

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer <token_valido>'); // Reemplaza con un token válido

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ message: 'Error en el servidor' });
    });
  });

 
});