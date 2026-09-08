import { useEffect, useState } from "react"
import { CreateNote } from "./CreateNote";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Descendant } from "slate";
import { Node } from "slate";
import { useNotes } from "../../hooks/useNotes";
import type { Note } from "../../interfaces/NoteType";

import backW from '../../assets/back_w.svg';

export const NoteEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();  
  const { fetchNote, updateNote, createNote } = useNotes();
  const navigate = useNavigate();
  const location = useLocation();
  const routerState = location.state as Note | undefined;

  const isEditMode = Boolean(id);

  const [isLoading, setIsLoading] = useState<boolean>(isEditMode);
  const [title, setTitle] = useState<string>('');
  const [editorValue, setEditorValue] = useState<Descendant[]>([{ type: 'paragraph', children: [{ text: '' }] }]);
  const [isArchived, setIsArchived] = useState<boolean>(false);

  const isTitleEmpty = title.trim() === '';
  const isEditorEmpty = editorValue.map(n => Node.string(n)).join('').trim() === '';

  useEffect(() => {
    if (!isEditMode || !id) {
      setIsLoading(false);
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
  }, [id, isEditMode, routerState]);

  const deserializeFromJson = (jsonString: string): Descendant[] => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    catch (error) {
      console.error('Invalid JSON string provided:', error);
    }

    return [{ type: 'paragraph', children: [{ text: '' }] }];
  };

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

  const handleSubmitButton = async () => {
    setIsLoading(true);

    if (isEditMode && id) {
      await updateNote(id, {
        title: title,
        content: JSON.stringify(editorValue),
        is_archived: isArchived
      });
    } 
    else {
      await createNote({
        title: title,
        content: JSON.stringify(editorValue), 
        is_archived: false
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

  return (
    <div className="max-w-4xl mx-auto my-5 p-5 rounded-md bg-white dark:bg-gray-800 border-1 border-slate-200 dark:border-slate-900">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Note Title"
        className="w-full text-4xl font-bold border-2 border-slate-300 rounded-md outline-none mb-3 p-2"
        maxLength={255}
      />

      <CreateNote initialValue={editorValue} onChange={setEditorValue}/>

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