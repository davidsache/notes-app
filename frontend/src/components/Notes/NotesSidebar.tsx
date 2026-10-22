import { useNavigate } from "react-router-dom";
import type { Note } from "../../interfaces/NoteType"
import type { Tag } from "../../interfaces/TagType";
import { useTags } from "../../hooks/useTags";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "../../context/ModalContext";

interface NotesSidebarProps {
  activeNote: Note | null;
  filteredNotes: Note[];
  setActiveNote: (note: Note) => void;
  tagFilter: Tag | null;
  clearTagFilter: (refetch: boolean) => void;
}

export const NotesSidebar: React.FC<NotesSidebarProps> = (props) => {
  const navigate = useNavigate();
  const { deleteTag } = useTags();
  const { t } = useTranslation();
  const { openModal } = useModal();

  const [isDeletingTag, setIsDeletingTag] = useState<boolean>(false);

  const handleDeleteTag = () => {
    if (props.tagFilter) {
      openModal({
        message: t('NotesSidebar.deleteText', { tagName: props.tagFilter.name }),
        onConfirm: () => confirmDeleteTag(props.tagFilter!.id)
      });
    }
  }

  const confirmDeleteTag = async (tagId: string) => {
    setIsDeletingTag(true);
    await deleteTag(tagId);
    props.clearTagFilter(true);
  }

  return (
    <div className="p-3 sm:p-4">
      {props.tagFilter && (
        <div className="mb-3">
          <p className="font-bold mb-2 text-sm sm:text-base text-center sm:text-start">
            {t('NotesSidebar.tag')} "{props.tagFilter.name}"
          </p>
          <div className="flex justify-center items-center sm:justify-normal sm:items-stretch gap-2 mb-3">
            <button 
              onClick={() => props.clearTagFilter(false)} 
              disabled={isDeletingTag}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold px-3 py-1.5 text-xs sm:text-sm rounded"
            >
              {t('NotesSidebar.clearTag')}
            </button>
            <button 
              onClick={handleDeleteTag} 
              disabled={isDeletingTag}
              className="bg-red-600 hover:bg-red-500 disabled:bg-red-400 text-white font-bold px-3 py-1.5 text-xs sm:text-sm rounded"
            >
              {t('NotesSidebar.deleteTag')}
            </button>
          </div>
          <hr className="border-t-2 border-slate-300"/>
        </div>
      )}

      {!props.tagFilter && (
        <button 
          onClick={() => navigate('/newNote')} 
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-sm sm:text-base mb-2"
        >
          {t('NotesSidebar.newNote')}
        </button>
      )}

      <div className="mt-2 divide-y divide-slate-200 dark:divide-slate-700 lg:divide-y-0 space-y-0.5">
        {props.filteredNotes.length > 0 ? props.filteredNotes.map((note) => (
          <div 
            key={note.id} 
            className={`
              hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md p-2.5 cursor-pointer transition-colors 
              ${props.activeNote?.id === note.id ? 'bg-slate-200 dark:bg-slate-600' : ''}
            `}
            onClick={() => props.setActiveNote(note)}
          >
            <h2 className="font-bold text-sm sm:text-base break-words">{note.title}</h2>
          </div>
        )) : (
          <p className="text-center text-sm text-gray-500 py-6">{t('NotesSidebar.noResults')}</p>
        )}
      </div>
    </div>
  );
}