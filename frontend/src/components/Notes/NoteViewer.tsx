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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
    <div className={mainStyles('p-3 sm:p-4 md:p-6 h-full w-full', userSettings)}>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words">
        {note.title}
      </h2>

      {noteTags.length > 0 && (
        <p className="text-xs sm:text-sm md:text-base mt-2 flex flex-wrap items-centertext-xs sm:text-sm md:text-base mt-2 flex flex-wrap items-center">
          <img className="inline w-4 h-4 sm:w-5 sm:h-5 ps-1 pe-1 shrink-0" src={isDark ? labelImgW : labelImgB}/>
          <span>{t('NoteViewer.tags')}</span>
          {noteTags.map((tag, index) => (
            <span key={tag.id}>
              &nbsp;{tag.name}
              {index < noteTags.length-1 ? ',' : ''}
            </span>
          ))}
        </p>
      )}

      <p className="my-2 text-xs sm:text-sm md:text-base flex items-center">
        <img className="inline w-4 h-4 sm:w-5 sm:h-5 ps-1 pe-1 shrink-0" src={isDark ? clockImgW : clockImgB} alt="Last edited"/> 
        <span>{t('NoteViewer.lastEdited')} {note.updated_at}</span>
      </p>

      <hr className="mx-1 sm:mx-2 my-3 sm:my-4 border-t-2 border-slate-300"/>

      <div className="text-sm sm:text-base">
        <Slate key={note.id} initialValue={value} editor={editor}>
          <Editable readOnly renderElement={renderElement} renderLeaf={renderLeaf}/>
        </Slate>
      </div>
    </div>
  );
}