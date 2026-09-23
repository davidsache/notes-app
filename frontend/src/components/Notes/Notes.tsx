import { useNavigate } from "react-router-dom";
import { useNotes } from "../../hooks/useNotes";
import { useEffect, useMemo, useState } from "react";
import { type Note } from "../../interfaces/NoteType";
import { NoteViewer } from "./NoteViewer";
import { NoteActions } from "./NoteActions";
import { Loading } from "../Loading";
import { extractSlateText } from "../../utils/slateFunctions";

interface NotesProps {
  view: 'allNotes' | 'archivedNotes' | 'settings';
  search: string | undefined;
}

export const Notes: React.FC<NotesProps> = ({ view, search }) => {
  const { fetchNotes, notes, isLoading } = useNotes();
  const navigate = useNavigate();
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  // When window view changes, hide the active note.
  useEffect(() => {
    setActiveNote(null);
  }, [view, search])

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const refetchNotes = () => {
    setActiveNote(null);
    fetchNotes();
  }

  const filteredNotes = useMemo(() => {
    if (!search) {
      return notes.filter((note) => view === 'archivedNotes' ? note.is_archived : note);
    }

    const term = search.toLowerCase();

    return notes.filter((note) => {
      const titleMatch = note.title.toLowerCase().includes(term);
      const contentMatch = extractSlateText(note.content).toLowerCase().includes(term);
      const tagsMatch = note.tag_names ? note.tag_names.toLowerCase().includes(term) : false;
      return titleMatch || contentMatch || tagsMatch;
    }).filter((note) => view === 'archivedNotes' ? note.is_archived : note);
  }, [notes, search, view]);

  if (isLoading && notes.length === 0) {
    return <div className="m-2"><Loading/></div>;
  }

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
          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className="hover:bg-slate-200 dark:hover:bg-slate-500 rounded-sm p-2 cursor-pointer" 
              onClick={() => setActiveNote(note)}
            >
              <h2 className="font-bold">{note.title}</h2>
            </div>
          ))}
        </div>
      </div>
      {
        activeNote && (
          <>
            <div className="basis-2/4 border-r-2 border-slate-300">
              <NoteViewer note={activeNote}/>
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