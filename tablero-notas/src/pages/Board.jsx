import { useState } from 'react';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import { useNotes } from '../context/NotesContext';

export default function Board() {
  const { notes, createNote } = useNotes();
  const [newlyCreatedId, setNewlyCreatedId] = useState(null);

  const handleNewNoteClick = async () => {
    const newNote = await createNote();
    if (newNote && newNote.id) {
      setNewlyCreatedId(newNote.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />

      <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center max-w-7xl w-full mx-auto">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Tablero Compartido</h1>
          <p className="text-xs text-slate-500">Arrastra y suelta las notas libremente sobre el lienzo.</p>
        </div>
        <button
          onClick={handleNewNoteClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition cursor-pointer"
        >
          + Nueva Nota
        </button>
      </div>

      {/* Lienzo libre para Post-its */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4">
        <div className="relative w-full h-[650px] bg-slate-200/60 border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden shadow-inner">
          {notes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              isNew={note.id === newlyCreatedId}
              onClearNew={() => setNewlyCreatedId(null)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}