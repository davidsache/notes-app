import { useNavigate } from "react-router-dom";
import type { Note } from "../../interfaces/NoteType"
import type { Tag } from "../../interfaces/TagType";
import { useTags } from "../../hooks/useTags";
import { useState } from "react";

interface NotesSidebarProps {
  activeNote: Note | null;
  filteredNotes: Note[];
  setActiveNote: (note: Note) => void;
  tagFilter: Tag | null;
  clearTagFilter: (refetch: boolean) => void;
}

export const NotesSidebar: React.FC<NotesSidebarProps> = (props) => {
  const navigate = useNavigate();
  const [isDeletingTag, setIsDeletingTag] = useState<boolean>(false);
  const { deleteTag } = useTags();

  const handleDeleteTag = async () => {
    if (props.tagFilter) {
      if (confirm(`Do you wish to delete the tag '${props.tagFilter.name}'? It will be removed from all associated notes as well.`)) {
        setIsDeletingTag(true);
        await deleteTag(props.tagFilter.id);
        props.clearTagFilter(true);
      }
    }
  }

  return (
    <div className={`p-2 ${props.activeNote ? 'basis-1/4 border-r-2 border-slate-300' : ''}`}>
      {props.tagFilter && (
        <>
          <p className="text-center font-bold mb-1">
            Tag: "{props.tagFilter.name}"
          </p>
          <div className="flex justify-center gap-1 mb-2">
            <button 
              onClick={() => props.clearTagFilter(false)} 
              disabled={isDeletingTag}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold px-2 py-1 rounded"
            >
              Clear tag
            </button>
            <button 
              onClick={handleDeleteTag} 
              disabled={isDeletingTag}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold px-2 py-1 rounded"
            >
              Delete tag
            </button>
          </div>
          <hr className="border-t-2 border-slate-300"/>
        </>
      )}

      {!props.tagFilter && (
        <button 
          onClick={() => navigate('/newNote')} 
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          + Create New note
        </button>
      )}

      <div className="p-2">
        {props.filteredNotes.length > 0 ? props.filteredNotes.map((note) => (
          <div 
            key={note.id} 
            className="hover:bg-slate-200 dark:hover:bg-slate-500 rounded-sm p-2 cursor-pointer" 
            onClick={() => props.setActiveNote(note)}
          >
            <h2 className="font-bold">{note.title}</h2>
          </div>
        )) : (
          <p className="text-center">No results</p>
        )}
      </div>
    </div>
  );
}