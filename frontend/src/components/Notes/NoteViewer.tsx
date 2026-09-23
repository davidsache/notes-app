import { Editable, Slate, withReact } from "slate-react";
import type { Note } from '../../interfaces/NoteType';
import { createEditor } from 'slate';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Element } from '../Slate/Element';
import { Leaf } from '../Slate/Leaf';
import { useTags } from "../../hooks/useTags";
import { useUsers } from "../../hooks/useUsers";
import { mainStyles } from "../../utils/noteTheme";
import { deserializeFromJson } from "../../utils/slateFunctions";

import clockImgW from '../../assets/clock_w.svg';
import clockImgB from '../../assets/clock_b.svg';
import labelImgW from '../../assets/label_w.svg';
import labelImgB from '../../assets/label_b.svg';

interface NoteViewerProps {
  note: Note;
}

export const NoteViewer: React.FC<NoteViewerProps> = ({ note }) => {
  const { darkMode } = useTheme();
  const { noteTags, fetchNoteTags } = useTags();
  const { userSettings, fetchUserSettings } = useUsers();

  const editor = useMemo(() => withReact(createEditor()), []);
  const value = useMemo(() => deserializeFromJson(note.content), [note.content]);

  const renderElement = useCallback((props: any) => <Element {...props}/>, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props}/>, []);
  const [userColor, setUserColor] = useState<string>('Auto');

  const isDark = userColor === 'Black' || userColor !== 'White' && darkMode;

  useEffect(() => {
    fetchNoteTags(note.id);
  }, [fetchNoteTags, note]);

  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  useEffect(() => {
    if (userSettings) setUserColor(userSettings.color_theme);
  }, [userSettings]);

  return (
    <div className={mainStyles('p-2', userSettings)}>
      <h2 className="text-4xl font-bold">{note.title}</h2>

      {noteTags.length > 0 && (
        <p>
          <img className="inline ps-1 pe-1" src={isDark ? labelImgW : labelImgB}/>
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
        <img className="inline ps-1 pe-1" src={isDark ? clockImgW : clockImgB} alt="Last edited"/> 
        Last edited at: {note.updated_at}
      </p>

      <hr className="mx-2 my-4 border-t-2 border-slate-300"/>

      <Slate key={note.id} initialValue={value} editor={editor}>
        <Editable readOnly renderElement={renderElement} renderLeaf={renderLeaf}/>
      </Slate>
    </div>
  );
}