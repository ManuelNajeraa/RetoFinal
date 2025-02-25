
export const login = async (credentials) => {
    try {
      const response = await axios.post('/api/login', credentials); 
      const token = response.data.token;
      localStorage.setItem('token', token); 
      return true; 
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  };
  
  export const logout = () => {
    localStorage.removeItem('token'); 
  };
  
  export const isLoggedIn = () => {
    const token = localStorage.getItem('token'); 
    return!!token; 
  };
  
  export const getToken = () => {
    return localStorage.getItem('token'); 
  };