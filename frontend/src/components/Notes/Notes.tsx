import { useNotes } from "../../hooks/useNotes";
import { useEffect, useMemo, useState } from "react";
import { type Note } from "../../interfaces/NoteType";
import { NoteViewer } from "./NoteViewer";
import { NoteActions } from "./NoteActions";
import { Loading } from "../Loading";
import { extractSlateText } from "../../utils/slateFunctions";
import type { Tag } from "../../interfaces/TagType";
import { NotesSidebar } from "./NotesSidebar";
import { useTranslation } from "react-i18next";

interface NotesProps {
  view: 'allNotes' | 'archivedNotes' | 'settings';
  search: string | null;
  tagFilter: Tag | null;
  clearTagFilter: (refetch: boolean) => void;
}

export const Notes: React.FC<NotesProps> = ({ view, search, tagFilter, clearTagFilter }) => {
  const { fetchNotes, notes, isLoading } = useNotes();
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const { t } = useTranslation();

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
    return <div className="m-4"><Loading/></div>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0">
      <div className={`${activeNote ? 'hidden lg:block lg:basis-1/4 lg:border-r-2 lg:border-slate-300' : 'w-full'} h-full overflow-y-auto`}>
        <NotesSidebar 
          activeNote={activeNote} 
          filteredNotes={filteredNotes} 
          setActiveNote={setActiveNote} 
          tagFilter={tagFilter}
          clearTagFilter={clearTagFilter}
        />
      </div>

      {activeNote && (
        <div className="flex flex-col lg:flex-row flex-1 lg:basis-3/4 h-full overflow-y-auto">
          <div className="lg:hidden flex items-center justify-between px-3 py-2 border-b border-slate-300 bg-slate-50 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => setActiveNote(null)}
              className="text-sm font-bold text-blue-600 dark:text-sky-400 flex items-center gap-1 py-1 px-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {t('Notes.goBack')}
            </button>
          </div>

          <div className="w-full lg:basis-2/3 lg:border-r-2 lg:border-slate-300 lg:overflow-y-auto flex-1">
            <NoteViewer note={activeNote}/>
          </div>
          
          <div className="w-full lg:basis-1/3 p-3 border-t lg:border-t-0 border-slate-300 lg:overflow-y-auto">
            <NoteActions note={activeNote} refetch={refetchNotes}/>
          </div>
        </div>
      )}
    </div>
  );
}