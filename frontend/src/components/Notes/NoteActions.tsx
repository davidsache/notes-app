import { useTheme } from '../../context/ThemeContext';
import { useNotes } from '../../hooks/useNotes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Note } from '../../interfaces/NoteType';
import { useTranslation } from 'react-i18next';

import archiveImgW from '../../assets/archive_w.svg';
import archiveImgB from '../../assets/archive_b.svg';
import deleteImgW from '../../assets/delete_w.svg';
import deleteImgB from '../../assets/delete_b.svg';
import editImgW from '../../assets/edit_w.svg';
import editImgB from '../../assets/edit_b.svg';
import loadingGifW from '../../assets/loading-w.gif';
import loadingGifB from '../../assets/loading-b.gif';
import { useModal } from '../../context/ModalContext';

interface NoteActionsProps {
  note: Note;
  refetch: () => void;
};

export const NoteActions: React.FC<NoteActionsProps> = ({ note, refetch }) => {
  const { darkMode } = useTheme();
  const { updateNote, deleteNote } = useNotes();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { openModal } = useModal();

  const [actionPending, setActionPending] = useState<boolean>(false);

  const handleArchiveNote = async () => {
    setActionPending(true);
    await updateNote(note.id, {
      content: note.content,
      title: note.title,
      is_archived: !note.is_archived,
      tag_ids: []
    });

    setActionPending(false);
    refetch();
  }

  const handleDeleteNote = () => {
    openModal({ 
      message: t('NoteActions.deleteNote', { noteName: note.title }), 
      onConfirm: confirmDeleteNode 
    });
  }

  const confirmDeleteNode = async () => {
    setActionPending(true);
    await deleteNote(note.id);

    setActionPending(false);
    refetch();
  }

  const handleEditNote = () => {
    navigate(`/edit/${note.id}`, { state: note });
  }

  return (
    <div className="flex flex-row flex-wrap sm:flex-nowrap lg:flex-col gap-2 w-full">
      <button 
        className="border-2 rounded border-slate-200 flex items-center justify-center lg:justify-start flex-1 lg:flex-initial w-full lg:max-w-lg p-2 text-xs sm:text-sm md:text-base hover:bg-slate-200 dark:hover:bg-slate-500 disabled:bg-slate-200 transition-colors"
        onClick={handleArchiveNote}
        disabled={actionPending}
      >
        {actionPending 
          ? <img className="inline w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 me-1.5 shrink-0" src={darkMode ? loadingGifW : loadingGifB} alt="Loading"/>
          : <img className="inline w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 me-1.5 shrink-0" src={darkMode ? archiveImgW : archiveImgB} alt="Archive note"/>
        }
        {note.is_archived ? t('NoteActions.unarchive') : t('NoteActions.archive')}
      </button>
      <button 
        className="border-2 rounded border-slate-200 flex items-center justify-center lg:justify-start flex-1 lg:flex-initial w-full lg:max-w-lg p-2 text-xs sm:text-sm md:text-base hover:bg-slate-200 dark:hover:bg-slate-500 disabled:bg-slate-200 transition-colors"
        onClick={handleDeleteNote}
        disabled={actionPending}
      >
        {actionPending 
          ? <img className="inline w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 me-1.5 shrink-0" src={darkMode ? loadingGifW : loadingGifB} alt="Loading"/>
          : <img className="inline w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 me-1.5 shrink-0" src={darkMode ? deleteImgW : deleteImgB} alt="Delete note"/>
        }
        {t('NoteActions.delete')}
      </button>
      <button
        className="border-2 rounded border-slate-200 flex items-center justify-center lg:justify-start flex-1 lg:flex-initial w-full lg:max-w-lg p-2 text-xs sm:text-sm md:text-base hover:bg-slate-200 dark:hover:bg-slate-500 disabled:bg-slate-200 transition-colors"
        onClick={handleEditNote}
        disabled={actionPending}
      >
        {actionPending 
          ? <img className="inline w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 me-1.5 shrink-0" src={darkMode ? loadingGifW : loadingGifB} alt="Loading"/>
          : <img className="inline w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 me-1.5 shrink-0" src={darkMode ? editImgW : editImgB} alt="Edit note"/>
        }
        {t('NoteActions.edit')}
      </button>
    </div>
  );
}