import { useState } from "react"
import { CreateNote } from "./CreateNote";
import backW from '../../assets/back_w.svg';
import { useNavigate } from "react-router-dom";
import type { Descendant } from "slate";
import { Node } from "slate";
import { useNotes } from "../../hooks/useNotes";

export const NoteEditor = () => {
  const { createNote } = useNotes();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const defaultEditorValue: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];
  const [editorValue, setEditorValue] = useState<Descendant[]>(defaultEditorValue);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Emptiness Check Logic
  const isTitleEmpty = title.trim() === '';
  const isEditorEmpty = editorValue.map(n => Node.string(n)).join('').trim() === '';

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

  const handleSaveNoteButton = async () => {
    setSubmitted(true);

    await createNote({
      title: title,
      content: JSON.stringify(editorValue), 
      is_archived: false
    });

    setSubmitted(false);
    navigate('/');
  };

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

      <CreateNote 
        initialValue={defaultEditorValue} 
        onChange={setEditorValue}
      />

      <div className="mt-3">
        <button 
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 me-2 rounded align-middle" 
          onClick={handleBackButton}
        >
          <img src={backW} alt="Back"/>
        </button>
        <button 
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded align-middle" 
          onClick={handleSaveNoteButton}
          disabled={isTitleEmpty || isEditorEmpty || submitted}
        >
          Save note
        </button>
      </div>
    </div>
  );
}