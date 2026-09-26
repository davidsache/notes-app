import { useNotes } from "../../hooks/useNotes";
import { useEffect, useMemo, useState } from "react";
import { type Note } from "../../interfaces/NoteType";
import { NoteViewer } from "./NoteViewer";
import { NoteActions } from "./NoteActions";
import { Loading } from "../Loading";
import { extractSlateText } from "../../utils/slateFunctions";
import type { Tag } from "../../interfaces/TagType";
import { NotesSidebar } from "./NotesSidebar";

interface NotesProps {
  view: 'allNotes' | 'archivedNotes' | 'settings';
  search: string | null;
  tagFilter: Tag | null;
  clearTagFilter: (refetch: boolean) => void;
}

export const Notes: React.FC<NotesProps> = ({ view, search, tagFilter, clearTagFilter }) => {
  const { fetchNotes, notes, isLoading } = useNotes();
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  // When window view changes, hide the active note.
  useEffect(() => {
    setActiveNote(null);
  }, [view, search, tagFilter])

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const refetchNotes = () => {
    setActiveNote(null);
    fetchNotes();
  }

  const filteredNotes = useMemo(() => {
    if (tagFilter) {
      const term = tagFilter.name.toLowerCase();

      return notes.filter((note) => 
        note.tag_names ? note.tag_names.toLowerCase().includes(term) : false
      ).filter((note) => view === 'archivedNotes' ? note.is_archived : note);
    }
    else if (search) {
      const term = search.toLowerCase();

      return notes.filter((note) => {
        const titleMatch = note.title.toLowerCase().includes(term);
        const contentMatch = extractSlateText(note.content).toLowerCase().includes(term);
        const tagsMatch = note.tag_names ? note.tag_names.toLowerCase().includes(term) : false 
        return titleMatch || contentMatch || tagsMatch;
      }).filter((note) => view === 'archivedNotes' ? note.is_archived : note);
    }
    else {
      return notes.filter((note) => view === 'archivedNotes' ? note.is_archived : note);
    }
  }, [notes, search, view, tagFilter]);

  if (isLoading && notes.length === 0) {
    return <div className="m-2"><Loading/></div>;
  }

  return (
    <div className="flex flex-row h-screen">
      <NotesSidebar 
        activeNote={activeNote} 
        filteredNotes={filteredNotes} 
        setActiveNote={setActiveNote} 
        tagFilter={tagFilter}
        clearTagFilter={clearTagFilter}
      />
      {activeNote && (
        <>
          <div className="basis-2/4 border-r-2 border-slate-300">
            <NoteViewer note={activeNote}/>
          </div>
          <div className="p-2 basis-1/4">
            <NoteActions note={activeNote} refetch={refetchNotes}/>
          </div>
        </>
      )}
    </div>
  );
}