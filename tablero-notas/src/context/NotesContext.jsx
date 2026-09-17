import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const { token, user } = useAuth();

  const getAuthHeaders = () => {
    const activeToken = token || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': activeToken ? `Bearer ${activeToken}` : ''
    };
  };

  const fetchNotes = async () => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return;

    try {
      const response = await fetch('/api/notes', { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error al obtener notas:', error);
    }
  };

  useEffect(() => {
    if (user && (token || localStorage.getItem('token'))) {
      fetchNotes();
    }
  }, [user, token]);

  const createNote = async () => {
    try {
     
      const newNoteData = {
        title: '',
        text: '',
        status: 'Pendiente',
        x: 500,
        y: 180,
      };

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newNoteData),
      });

      if (response.ok) {
        const createdNote = await response.json();
        await fetchNotes();
        return createdNote; 
      }
    } catch (error) {
      console.error('Error al crear nota:', error);
    }
  };

  const updateNote = async (id, updatedFields) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        await fetchNotes();
      }
    } catch (error) {
      console.error('Error al actualizar nota:', error);
    }
  };

  const updateNotePosition = async (id, x, y) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, x, y } : n))
    );

    try {
      await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ x, y }),
      });
    } catch (error) {
      console.error('Error al guardar posición:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        await fetchNotes();
      }
    } catch (error) {
      console.error('Error al eliminar nota:', error);
    }
  };

  return (
    <NotesContext.Provider
      value={{ notes, createNote, updateNote, updateNotePosition, deleteNote, fetchNotes }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
export default NotesContext;