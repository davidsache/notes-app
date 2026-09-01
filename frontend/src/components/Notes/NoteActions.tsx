import { useTheme } from '../../context/ThemeContext';
import { useNotes } from '../../hooks/useNotes';
import { useState } from 'react';

import archiveImgW from '../../assets/archive_w.svg';
import archiveImgB from '../../assets/archive_b.svg';
import deleteImgW from '../../assets/delete_w.svg';
import deleteImgB from '../../assets/delete_b.svg';
import loadingGifW from '../../assets/loading-w.gif';
import loadingGifB from '../../assets/loading-b.gif';

interface NoteActionsProps {
  id: number | string;
  content: string;
  title: string;
  is_archived: boolean;
  refetch: () => void;
};

export const NoteActions: React.FC<NoteActionsProps> = ({ content, id, is_archived, title, refetch }) => {
  const { darkMode } = useTheme();
  const { updateNote, deleteNote } = useNotes();
  const [actionPending, setActionPending] = useState<boolean>(false);

  const handleArchiveNote = async () => {
    setActionPending(true);
    await updateNote(id, {
      content: content,
      title: title,
      is_archived: !is_archived
    });

    setActionPending(false);
    refetch();
  }

  const handleDeleteNote = async () => {
    if (confirm("Do you wish to delete the note?")) {
      setActionPending(true);
      await deleteNote(id);

      setActionPending(false);
      refetch();
    }
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
        {is_archived ? 'Unarchive Note' : 'Archive Note'}
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
    </div>
  );
}