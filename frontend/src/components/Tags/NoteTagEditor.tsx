import { useEffect } from "react";
import { useTags } from "../../hooks/useTags";
import { TagBadge } from "./TagBadge";

interface NoteTagEditorProps {
  noteId: string;
}

export const NoteTagEditor: React.FC<NoteTagEditorProps> = ({ noteId }) => {
  const { tags, noteTags, fetchAllTags, fetchNoteTags, addNoteTag, deleteNoteTag } = useTags();

  useEffect(() => {
    fetchAllTags();
    fetchNoteTags(noteId);
  }, [noteId, fetchAllTags, fetchNoteTags]);

  const availableTags = tags.filter(
    (tag) => !noteTags.some((nt) => nt.id === tag.id)
  );

  return (
    <div className="flex mt-2">
      <div className="basis-1/2">
        <h4>Note Tags</h4>
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
      <div className="basis-1/2">
        <h4>Available Tags</h4>
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