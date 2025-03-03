// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminDashboard() {
  const [users, setUsers] = useState();
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación al cargar el componente
    const isAuthenticated = checkAdminAuthentication();
    if (!isAuthenticated) {
      navigate('/admin-login'); // Redirigir usando navigate
    }

    // Cargar la lista de usuarios
    loadUserList();
  },);

  const handleAddUser = async (event) => {
    event.preventDefault();

    const name = document.getElementById("new-name").value;
    const email = document.getElementById("new-email").value;
    const password = document.getElementById("new-password").value;
    const role = document.getElementById("new-role").value;

    try {
      await api.post('/api/users', { name, email, password, role });
      showMessage('Usuario agregado correctamente.', 'success');
      // Actualiza la lista de usuarios
      loadUserList();
      // Limpia el formulario
      event.target.reset();
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      showMessage('Error al agregar el usuario.', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      showMessage('Usuario eliminado correctamente.', 'success');
      loadUserList();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      showMessage('Error al eliminar el usuario.', 'error');
    }
  };

  const handleEditUser = async (id) => {
    const userToUpdate = users.find(user => user._id === id);

    if (!userToUpdate) {
      showMessage('Usuario no encontrado.', 'error');
      return;
    }

    const newName = prompt("Ingrese el nuevo nombre:", userToUpdate.name);
    const newEmail = prompt("Ingrese el nuevo correo electrónico:", userToUpdate.email);
    const newPassword = prompt("Ingrese la nueva contraseña:", userToUpdate.password);
    const newRole = prompt("Ingrese el nuevo rol (user/admin):", userToUpdate.role);

    if (!newName || !newEmail || !newPassword || (newRole !== 'user' && newRole !== 'admin')) {
      showMessage('Edición cancelada. Datos inválidos o faltantes.', 'error');
      return;
    }

    try {
      await api.put(`/api/users/${id}`, {
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole
      });
      showMessage('Usuario actualizado correctamente.', 'success');
      loadUserList();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      showMessage('Error al actualizar el usuario.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate('/'); // Reemplaza '/' con la ruta de tu página de inicio de sesión
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const loadUserList = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data.data); // Ajusta según la estructura de tu respuesta
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      showMessage('Error al obtener los usuarios', 'error');
    }
  };

  return (
    <div>
      <h1>Panel de Administración</h1>

      <h2>Agregar Nuevo Usuario</h2>
      <form id="add-user-form" onSubmit={handleAddUser}>
        <div>
          <label htmlFor="new-name">Nombre:</label>
          <input type="text" id="new-name" required />
        </div>
        <div>
          <label htmlFor="new-email">Correo Electrónico:</label>
          <input type="email" id="new-email" required />
        </div>
        <div>
          <label htmlFor="new-password">Contraseña:</label>
          <input type="password" id="new-password" required />
        </div>
        <div>
          <label htmlFor="new-role">Rol:</label>
          <select id="new-role">
            <option value="user">Usuario Regular</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit">Agregar Usuario</button>
      </form>

      <h2>Administrar Usuarios</h2>
      <ul id="user-list">
        {users.map(user => (
          <li key={user._id}>
            {user.name} - {user.email} ({user.role})
            <button onClick={() => handleEditUser(user._id)} style={{ marginLeft: '10px' }}>
              Editar
            </button>
            <button onClick={() => handleDeleteUser(user._id)} style={{ marginLeft: '10px' }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <button id="logout" onClick={handleLogout}>
        Cerrar Sesión
      </button>

      <div id="message-container">
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>

      <h2>Eliminar Cuenta</h2>
      <button id="delete-account-btn">Eliminar mi cuenta</button>
    </div>
  );
}

// Función para verificar si el administrador está autenticado
function checkAdminAuthentication() {
    const users = JSON.parse(localStorage.getItem("users")) ;
    const email = localStorage.getItem("admin-email");
    const password = localStorage.getItem("admin-password");

    const user = users.find(user => user.email === email && user.password === password);

    if (user && user.role === "admin") {
        return true; 
    } else {
        return false; 
    }
}

export default AdminDashboard;