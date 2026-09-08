import { useNavigate } from "react-router-dom";
import { useNotes } from "../../hooks/useNotes";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { type Note } from "../../interfaces/NoteType";
import { NoteViewer } from "./NoteViewer";
import { NoteActions } from "./NoteActions";

import loadingImgW from '../../assets/loading-w.gif';
import loadingImgB from '../../assets/loading-b.gif';

interface ViewType {
  view: 'allNotes' | 'archivedNotes' | 'settings';
}

export const Notes: React.FC<ViewType> = ({ view }) => {
  const { fetchNotes, notes, isLoading } = useNotes();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  // When window view changes, hide the active note.
  useEffect(() => {
    setActiveNote(null);
  }, [view])

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const refetchNotes = () => {
    setActiveNote(null);
    fetchNotes();
  }

  const activeNotes = notes
    .filter((note) => view === 'archivedNotes' ? note.is_archived : note)
    .map((note) => (
      <div 
        key={note.id} 
        className="hover:bg-slate-200 dark:hover:bg-slate-500 rounded-sm p-2 cursor-pointer" 
        onClick={() => setActiveNote(note)}
      >
        <h2 className="font-bold">{note.title}</h2>
      </div>
    ));

  return (
    <div className="flex flex-row h-screen">
      <div className={`p-2 ${activeNote ? 'basis-1/4 border-r-2 border-slate-300' : ''}`}>
        <button 
          onClick={() => navigate('/newNote')} 
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          + Create New note
        </button>
        <div className="p-2">
          {isLoading 
            ? <img className="w-8 mt-1" src={darkMode ? loadingImgW : loadingImgB} alt="Loading"/> 
            : activeNotes
          }
        </div>
      </div>
      {
        activeNote && (
          <>
            <div className="p-2 basis-2/4 border-r-2 border-slate-300">
              <NoteViewer 
                id={activeNote.id} 
                content={activeNote.content} 
                title={activeNote.title} 
                created_at={activeNote.created_at}
                updated_at={activeNote.updated_at}
                is_archived={activeNote.is_archived}
              />
            </div>
            <div className="p-2 basis-1/4">
              <NoteActions note={activeNote} refetch={refetchNotes}/>
            </div>
          </>
        )
      }
    </div>
  );
}