import { useTheme } from '../../context/ThemeContext';
import { useNotes } from '../../hooks/useNotes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Note } from '../../interfaces/NoteType';

import archiveImgW from '../../assets/archive_w.svg';
import archiveImgB from '../../assets/archive_b.svg';
import deleteImgW from '../../assets/delete_w.svg';
import deleteImgB from '../../assets/delete_b.svg';
import editImgW from '../../assets/edit_w.svg';
import editImgB from '../../assets/edit_b.svg';
import loadingGifW from '../../assets/loading-w.gif';
import loadingGifB from '../../assets/loading-b.gif';

interface NoteActionsProps {
  note: Note;
  refetch: () => void;
};

export const NoteActions: React.FC<NoteActionsProps> = ({ note, refetch }) => {
  const { darkMode } = useTheme();
  const { updateNote, deleteNote } = useNotes();
  const navigate = useNavigate();
  const [actionPending, setActionPending] = useState<boolean>(false);

  const handleArchiveNote = async () => {
    setActionPending(true);
    await updateNote(note.id, {
      content: note.content,
      title: note.title,
      is_archived: !note.is_archived
    });

    setActionPending(false);
    refetch();
  }

  const handleDeleteNote = async () => {
    if (confirm("Do you wish to delete the note?")) {
      setActionPending(true);
      await deleteNote(note.id);

      setActionPending(false);
      refetch();
    }
  }

  const handleEditNote = () => {
    navigate(`/edit/${note.id}`, { state: { note: note } });
  }

  return (
    <div className="flex flex-col flex-wrap">
      <button 
        className="border-2 rounded border-slate-200 block max-w-lg flex-grow p-2 hover:bg-slate-200 dark:hover:bg-slate-500 disabled:bg-slate-200"
        onClick={handleArchiveNote}
        disabled={actionPending}
      >
        {actionPending 
          ? <img className="inline w-6 me-1" src={darkMode ? loadingGifW : loadingGifB} alt="Loading"/>
          : <img className="inline w-6 me-1" src={darkMode ? archiveImgW : archiveImgB} alt="Archive note"/>
        }
        {note.is_archived ? 'Unarchive Note' : 'Archive Note'}
      </button>
      <button 
        className="border-2 rounded border-slate-200 block max-w-lg flex-grow p-2 my-2 hover:bg-slate-200 dark:hover:bg-slate-500 disabled:bg-slate-200"
        onClick={handleDeleteNote}
        disabled={actionPending}
      >
        {actionPending 
          ? <img className="inline w-6 me-1" src={darkMode ? loadingGifW : loadingGifB} alt="Loading"/>
          : <img className="inline w-6 me-1" src={darkMode ? deleteImgW : deleteImgB} alt="Delete note"/>
        }
        Delete Note
      </button>
      <button
        className="border-2 rounded border-slate-200 block max-w-lg flex-grow p-2 hover:bg-slate-200 dark:hover:bg-slate-500 disabled:bg-slate-200"
        onClick={handleEditNote}
        disabled={actionPending}
      >
        {actionPending 
          ? <img className="inline w-6 me-1" src={darkMode ? loadingGifW : loadingGifB} alt="Loading"/>
          : <img className="inline w-6 me-1" src={darkMode ? editImgW : editImgB} alt="Edit note"/>
        }
        Edit Note
      </button>
    </div>
  );
}