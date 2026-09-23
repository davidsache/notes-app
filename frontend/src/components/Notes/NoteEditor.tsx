import { useEffect, useState } from "react"
import { CreateNote } from "./CreateNote";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Descendant } from "slate";
import { Node } from "slate";
import { useNotes } from "../../hooks/useNotes";
import type { Note } from "../../interfaces/NoteType";
import { NoteTagEditor } from "../Tags/NoteTagEditor";
import { useTags } from "../../hooks/useTags";
import { TagBadge } from "../Tags/TagBadge";
import { useUsers } from "../../hooks/useUsers";
import { mainStyles } from "../../utils/noteTheme";
import { deserializeFromJson } from "../../utils/slateFunctions";

import backW from '../../assets/back_w.svg';

export const NoteEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();  
  const { fetchNote, updateNote, createNote } = useNotes();
  const { tags, fetchAllTags } = useTags();
  const navigate = useNavigate();
  const location = useLocation();
  const routerState = location.state as Note | undefined;

  const isEditMode = Boolean(id);

  const [isLoading, setIsLoading] = useState<boolean>(isEditMode);
  const [title, setTitle] = useState<string>('');
  const [editorValue, setEditorValue] = useState<Descendant[]>([{ type: 'paragraph', children: [{ text: '' }] }]);
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const [pendingTagsIds, setPendingTagsIds] = useState<string[]>([]);

  const isTitleEmpty = title.trim() === '';
  const isEditorEmpty = editorValue.map(n => Node.string(n)).join('').trim() === '';

  const { userSettings, fetchUserSettings } = useUsers();
  
  useEffect(() => {
    if (!isEditMode || !id) {
      setIsLoading(false);
      fetchAllTags();
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    // The note was passed using the route.
    if (routerState?.title && routerState?.content && routerState?.is_archived !== undefined) {
      setTitle(routerState.title);
      setEditorValue(deserializeFromJson(routerState.content));
      setIsArchived(routerState.is_archived);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      const note = await fetchNote(id);
      if (!isMounted) return;

      if (!note) {
        navigate('/', { replace: true });
        return;
      }

      setTitle(note.title);
      setEditorValue(deserializeFromJson(note.content));
      setIsArchived(note.is_archived);

      setIsLoading(false);
    };

    // The note needs to be fetched (if it's not possible then navigate to the dashboard).
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, isEditMode, routerState, fetchAllTags]);

  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const plainText = e.target.value.replace(/[\r\n]+/g, ' ');
    if (plainText.length >= 255) return;
    setTitle(plainText);
  };

  const handleBackButton = () => {
    if (confirm('Go back to the dashboard? All changes made will be erased.')) {
      navigate('/');
    }
  };

  const handleTogglePendingTag = (tagId: string) => {
    setPendingTagsIds((prev) => 
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  }

  const handleSubmitButton = async () => {
    setIsLoading(true);

    if (isEditMode && id) {
      await updateNote(id, {
        title: title,
        content: JSON.stringify(editorValue),
        is_archived: isArchived,
        tag_ids: []
      });
    } 
    else {
      await createNote({
        title: title,
        content: JSON.stringify(editorValue), 
        is_archived: false,
        tag_ids: pendingTagsIds
      });
    }

    setIsLoading(false);
    navigate('/');
  };



  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto my-5 p-5 text-center dark:text-white">
        Loading note...
      </div>
    );
  }

  const selectedTags = tags.filter((tag) => pendingTagsIds.includes(tag.id));
  const availableTags = tags.filter((tag) => !pendingTagsIds.includes(tag.id));

  return (
    <div className={mainStyles('max-w-4xl mx-auto my-5 p-5 rounded-md border-1 border-slate-200 dark:border-slate-900', userSettings)}>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Note Title"
        className="w-full text-4xl font-bold border-2 border-slate-300 rounded-md outline-none mb-3 p-2"
        maxLength={255}
      />

      <CreateNote 
        initialValue={editorValue} 
        userSettings={userSettings} 
        onChange={setEditorValue}
      />

      {!isEditMode && (
        <div className="flex mt-2">
          <div className="basis-1/2">
            <h4>Note Tags</h4>
            {selectedTags.map((tag) => (
              <TagBadge 
                key={tag.id}
                available={false} 
                onAddedTag={() => handleTogglePendingTag(tag.id)} 
                onDeletedTag={() => handleTogglePendingTag(tag.id)}
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
                onAddedTag={() => handleTogglePendingTag(tag.id)}
                onDeletedTag={() => handleTogglePendingTag(tag.id)}
                tag={tag}
              />
            ))}
          </div>
        </div>
      )}

      {isEditMode && id && (
        <NoteTagEditor noteId={id}/>
      )}

      <div className="mt-3">
        <button 
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 me-2 rounded align-middle" 
          onClick={handleBackButton}
        >
          <img src={backW} alt="Back"/>
        </button>
        <button 
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded align-middle" 
          onClick={handleSubmitButton}
          disabled={isTitleEmpty || isEditorEmpty || isLoading}
        >
          {isEditMode ? 'Update note' : 'Save note'}
        </button>
      </div>
    </div>
  );
}