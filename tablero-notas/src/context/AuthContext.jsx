import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState([]);

  const getAuthHeaders = () => {
    const activeToken = token || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': activeToken ? `Bearer ${activeToken}` : ''
    };
  };

  const fetchUsers = async () => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return;

    try {
      const response = await fetch('/api/users', { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  useEffect(() => {
    if (user && user.role === 'Administrador' && (token || localStorage.getItem('token'))) {
      fetchUsers();
    }
  }, [user, token]);

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Credenciales inválidas.');
    }

    const userSession = {
      ...data.user,
      isActive: data.user.isActive ?? data.user.is_active
    };

    setUser(userSession);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(userSession));
    localStorage.setItem('token', data.token);

    return userSession;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

const createUser = async (newUser) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(newUser),
  });

  const data = await response.json();

  if (!response.ok) {
    // Lanza el mensaje exacto de error que devuelve Express (ej: "El correo electrónico ya está registrado.")
    throw new Error(data.error || 'Error al crear usuario');
  }

  await fetchUsers(); // Recargar la lista actualizada desde la BD
};

  const updateUser = async (id, updatedFields) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedFields),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar usuario');
    }

    if (user && user.id === id) {
      const updatedSession = { ...user, ...data };
      setUser(updatedSession);
      localStorage.setItem('user', JSON.stringify(updatedSession));
    }

    await fetchUsers();
  };

  const deleteUser = async (id) => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al eliminar usuario');
  }

  await fetchUsers(); 
  };


  return (
    <AuthContext.Provider value={{ user, token, users, login, logout, createUser, updateUser, deleteUser, fetchUsers }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => useContext(AuthContext);
export default AuthContext;