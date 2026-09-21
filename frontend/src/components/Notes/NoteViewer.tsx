import { Editable, Slate, withReact } from "slate-react";
import type { Note } from '../../interfaces/NoteType';
import { createEditor, type Descendant } from 'slate';
import { useCallback, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Element } from '../Slate/Element';
import { Leaf } from '../Slate/Leaf';
import { useTags } from "../../hooks/useTags";

import clockImgW from '../../assets/clock_w.svg';
import clockImgB from '../../assets/clock_b.svg';
import archiveImgW from '../../assets/archive_w.svg';
import archiveImgB from '../../assets/archive_b.svg';
import labelImgW from '../../assets/label_w.svg';
import labelImgB from '../../assets/label_b.svg';

interface NoteViewerProps {
  note: Note;
}

const deserializeFromJson = (jsonString: string): Descendant[] => {
  try {
    const parsed = JSON.parse(jsonString);

    if (Array.isArray(parsed) && parsed.length > 0) 
      return parsed;
  }
  catch (error) {
    console.error('Invalid JSON string provided:', error);
  }

  return [{ type: 'paragraph', children: [{ text: '' }] }];
}

export const NoteViewer: React.FC<NoteViewerProps> = ({ note }) => {
  const { darkMode } = useTheme();
  const { noteTags, fetchNoteTags } = useTags();

  const editor = useMemo(() => withReact(createEditor()), []);
  const value = useMemo(() => deserializeFromJson(note.content), [note.content]);

  const renderElement = useCallback((props: any) => <Element {...props}/>, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props}/>, []);

  useEffect(() => {
    fetchNoteTags(note.id);
  }, [fetchNoteTags, note]);

  return (
    <>
      <h2 className="text-4xl font-bold">{note.title}</h2>
      {noteTags.length > 0 && (
        <p>
          <img className="inline ps-1 pe-1" src={darkMode ? labelImgW : labelImgB}/>
          Tags:
          {noteTags.map((tag, index) => (
            <span key={tag.id}>
              &nbsp;{tag.name}
              {index < noteTags.length-1 ? ',' : ''}
            </span>
          ))}
        </p>
      )}
      <p className="my-2">
        <img className="inline ps-1 pe-1" src={darkMode ? clockImgW : clockImgB} alt="Last edited"/> 
        Last edited at: {note.updated_at}
      </p>
      <hr className="mx-2 my-4 border-t-2 border-slate-300"/>

      <Slate key={note.id} initialValue={value} editor={editor}>
        <Editable readOnly renderElement={renderElement} renderLeaf={renderLeaf}/>
      </Slate>
    </>
  );
}