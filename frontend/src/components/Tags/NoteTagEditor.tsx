import { useEffect } from "react";
import { useTags } from "../../hooks/useTags";
import { TagBadge } from "./TagBadge";
import { useTranslation } from "react-i18next";

interface NoteTagEditorProps {
  noteId: string;
}

export const NoteTagEditor: React.FC<NoteTagEditorProps> = ({ noteId }) => {
  const { tags, noteTags, fetchAllTags, fetchNoteTags, addNoteTag, deleteNoteTag } = useTags();
  const { t } = useTranslation();

  useEffect(() => {
    fetchAllTags();
    fetchNoteTags(noteId);
  }, [noteId, fetchAllTags, fetchNoteTags]);

  const availableTags = tags.filter(
    (tag) => !noteTags.some((nt) => nt.id === tag.id)
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-3 sm:mt-4 w-full">
      <div className="w-full sm:basis-1/2 min-w-0">
        <h4 className="text-sm sm:text-base font-semibold mb-2">
          {t('NoteTagEditor.noteTags')}
        </h4>
        {noteTags.map((tag) => (
          <TagBadge 
            key={tag.id}
            available={false} 
            onAddedTag={() => addNoteTag(noteId, tag.id)} 
            onDeletedTag={() => deleteNoteTag(noteId, tag.id)}
            tag={tag}
          />
        ))}
      </div>
      <div className="w-full sm:basis-1/2 min-w-0">
        <h4 className="text-sm sm:text-base font-semibold mb-2">
          {t('NoteTagEditor.availableTags')}
        </h4>
        {availableTags.map((tag) => (
          <TagBadge
            key={tag.id}
            available={true}
            onAddedTag={() => addNoteTag(noteId, tag.id)}
            onDeletedTag={() => deleteNoteTag(noteId, tag.id)}
            tag={tag}
          />
        ))}
      </div>
    </div>
  );
}