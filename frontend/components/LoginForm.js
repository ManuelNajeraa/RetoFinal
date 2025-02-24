import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.post('/api/login', { // Ajusta la ruta de tu backend
        email,
        password,
      });

      if (response.ok) {
        // Inicio de sesión exitoso
        //... (manejar la respuesta del backend, como guardar el token)
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      setError('Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Correo electrónico:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Iniciar sesión</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default LoginForm;