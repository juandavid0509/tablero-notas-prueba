import { useState, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';

export default function NoteCard({ note, isNew, onClearNew }) {
  const { updateNote, updateNotePosition, deleteNote } = useNotes();
  
  // Si es recién creada o no tiene título/texto, iniciar en modo edición
  const [isEditing, setIsEditing] = useState(isNew || (!note.title && !note.text));
  const [title, setTitle] = useState(note.title || '');
  const [text, setText] = useState(note.text || '');
  const [status, setStatus] = useState(note.status || 'Pendiente');

  useEffect(() => {
    if (isNew) {
      setIsEditing(true);
    }
  }, [isNew]);

  // Colores según estado del Post-it
  const statusColors = {
    Pendiente: 'bg-amber-100 border-amber-300 text-amber-900',
    'En curso': 'bg-sky-100 border-sky-300 text-sky-900',
    Hecho: 'bg-emerald-100 border-emerald-300 text-emerald-900',
  };

  // Arrastrar y Soltar (Drag & Drop con Coordenadas)
  const handleMouseDown = (e) => {
    if (isEditing) return; // No arrastrar si se está editando texto

    const canvas = e.currentTarget.parentElement;
    const canvasRect = canvas.getBoundingClientRect();
    const startX = e.clientX - note.x;
    const startY = e.clientY - note.y;

    const handleMouseMove = (moveEvent) => {
      let newX = moveEvent.clientX - startX;
      let newY = moveEvent.clientY - startY;

      // Limitar dentro del lienzo
      newX = Math.max(10, Math.min(newX, canvasRect.width - 240));
      newY = Math.max(10, Math.min(newY, canvasRect.height - 240));

      updateNotePosition(note.id, newX, newY);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleSave = async () => {
    const finalTitle = title.trim() || 'Sin título';
    const finalText = text.trim() || 'Sin contenido';
    
    await updateNote(note.id, { title: finalTitle, text: finalText, status });
    setIsEditing(false);
    if (onClearNew) onClearNew();
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{ left: `${note.x}px`, top: `${note.y}px` }}
      className={`absolute w-60 p-4 rounded-xl shadow-md border-2 transition-shadow hover:shadow-lg ${
        isEditing ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
      } ${statusColors[note.status] || 'bg-amber-100 border-amber-300'}`}
    >
      {/* Encabezado Nota */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/60">
          {note.status}
        </span>
        
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs px-2 py-0.5 rounded bg-white/80 hover:bg-white font-semibold text-slate-700 cursor-pointer"
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
          <button
            onClick={() => deleteNote(note.id)}
            className="text-xs px-2 py-0.5 rounded bg-rose-500 hover:bg-rose-600 font-semibold text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Contenido Formulario vs Vista */}
      {isEditing ? (
        <div className="space-y-2 mt-2 cursor-auto" onMouseDown={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs font-bold p-1 border rounded bg-white"
            placeholder="Título de la nota..."
            autoFocus
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full text-xs p-1 border rounded bg-white h-16 resize-none"
            placeholder="Escribe el contenido aquí..."
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full text-xs p-1 border rounded bg-white font-semibold"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En curso">En curso</option>
            <option value="Hecho">Hecho</option>
          </select>
          <button
            onClick={handleSave}
            className="w-full bg-slate-900 text-white text-xs py-1 rounded font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Guardar
          </button>
        </div>
      ) : (
        <div className="mt-1">
          <h3 className="font-bold text-sm text-slate-800 break-words">{note.title}</h3>
          <p className="text-xs text-slate-700 mt-1 break-words whitespace-pre-wrap">{note.text}</p>
        </div>
      )}
    </div>
  );
}