import clockImgW from '../../assets/clock_w.svg';
import clockImgB from '../../assets/clock_b.svg';
import { Editable, Slate, withReact } from "slate-react";
import type { Note } from '../../interfaces/NoteType';
import { createEditor } from 'slate';
import { useCallback, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Element } from '../Slate/Element';
import { Leaf } from '../Slate/Leaf';

const deserializeFromJson = (jsonString: string) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  }
  catch (error) {
    console.error('Invalid JSON string provided:', error);
  }

  return [{ type: 'paragraph', children: [{ text: '' }] }];
}

export const NoteViewer = ({ id, title, content, is_archived, created_at, updated_at }: Note) => {
  const { darkMode } = useTheme();

  const editor = useMemo(() => withReact(createEditor()), []);
  const value = useMemo(() => deserializeFromJson(content), [content]);

  const renderElement = useCallback((props: any) => <Element {...props}/>, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props}/>, []);

  return (
    <>
      <h2 className="text-4xl font-bold">{title}</h2>
      <p className="my-2">
        <img className="inline ps-1 pe-1" src={darkMode ? clockImgW : clockImgB} alt="Last edited"/>
        Last edited at: {updated_at}
      </p>

      <hr className="mx-2 my-4 border-t-2 border-slate-300"/>

      <Slate key={id} initialValue={value} editor={editor}>
        <Editable readOnly renderElement={renderElement} renderLeaf={renderLeaf}/>
      </Slate>
    </>
  );
}