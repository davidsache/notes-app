import React, { useCallback, useEffect, useState } from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate, ReactEditor } from 'slate-react';
import { Editor, Transforms, createEditor, type Descendant, Element as SlateElement, type BaseEditor } from 'slate';
import { withHistory, HistoryEditor } from 'slate-history';
import { useTheme } from '../../context/ThemeContext';
import { Element } from '../Slate/Element';
import { Leaf } from '../Slate/Leaf';
import type { UserSettings } from '../../interfaces/UserSettings';

import boldB from '../../assets/slate/bold_b.svg';
import boldW from '../../assets/slate/bold_w.svg';
import italicB from '../../assets/slate/italic_b.svg';
import italicW from '../../assets/slate/italic_w.svg';
import underlineB from '../../assets/slate/underline_b.svg';
import underlineW from '../../assets/slate/underline_w.svg';
import codeB from '../../assets/slate/code_b.svg';
import codeW from '../../assets/slate/code_w.svg';
import headingOneB from '../../assets/slate/heading_one_b.svg';
import headingOneW from '../../assets/slate/heading_one_w.svg';
import headingTwoB from '../../assets/slate/heading_two_b.svg';
import headingTwoW from '../../assets/slate/heading_two_w.svg';
import quotesB from '../../assets/slate/quotes_b.svg';
import quotesW from '../../assets/slate/quotes_w.svg';
import numberedListB from '../../assets/slate/numbered_list_b.svg';
import numberedListW from '../../assets/slate/numbered_list_w.svg';
import bulletListB from '../../assets/slate/bullet_list_b.svg';
import bulletListW from '../../assets/slate/bullet_list_w.svg';
import alignLeftB from '../../assets/slate/align_left_b.svg';
import alignLeftW from '../../assets/slate/align_left_w.svg';
import alignRightB from '../../assets/slate/align_right_b.svg';
import alignRightW from '../../assets/slate/align_right_w.svg';
import alignCenterB from '../../assets/slate/align_center_b.svg';
import alignCenterW from '../../assets/slate/align_center_w.svg';
import alignJustifyB from '../../assets/slate/align_justify_b.svg';
import alignJustifyW from '../../assets/slate/align_justify_w.svg';

// TypeScript Module Augmentation for Slate
export type BlockType =
  | 'paragraph'
  | 'block-quote'
  | 'bulleted-list'
  | 'heading-one'
  | 'heading-two'
  | 'list-item'
  | 'numbered-list';

export type MarkType = 'bold' | 'italic' | 'underline' | 'code';

export type CustomElement = {
  type: BlockType;
  align?: 'left' | 'center' | 'right' | 'justify';
  children: CustomText[];
};

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// Constants and Helpers
const HOTKEYS: Record<string, MarkType> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const isBlockActive = (editor: Editor, format: string, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as any)[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: MarkType) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleBlock = (editor: Editor, format: BlockType | string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });

  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : (format as any),
    };
  } 
  else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : (format as BlockType),
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format as BlockType, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: MarkType) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } 
  else {
    Editor.addMark(editor, format, true);
  }
};

const BlockButton = ({ format, icon }: { format: BlockType | string; icon: string }) => {
  const editor = useSlate();
  const active = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  );
  
  return (
    <button
      className={`p-1 sm:p-1.5 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors ${active ? 'bg-slate-400 dark:bg-slate-500' : ''}`}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <img src={icon} alt={format}/>
    </button>
  );
};

const MarkButton = ({ format, icon }: { format: MarkType; icon: string }) => {
  const editor = useSlate();
  const active = isMarkActive(editor, format);

  return (
    <button
      className={`p-1 sm:p-1.5 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors ${active ? 'bg-slate-400 dark:bg-slate-500' : ''}`}
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <img src={icon} alt={format}/>
    </button>
  );
};

const onEditableKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, editor: Editor) => {
  for (const hotkey in HOTKEYS) {
    if (isHotkey(hotkey, event as any)) {
      event.preventDefault();
      const mark = HOTKEYS[hotkey];
      toggleMark(editor, mark);
    }
  }
}

interface CreateNoteProps {
  initialValue: Descendant[];
  userSettings: UserSettings | undefined;
  onChange: (value: Descendant[]) => void;
}

export const CreateNote: React.FC<CreateNoteProps> = ({ initialValue, userSettings, onChange }) => {
  const { darkMode } = useTheme();
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [userColor, setUserColor] = useState<string>('Auto');

  const isDark = userColor === 'Black' || userColor !== 'White' && darkMode;

  useEffect(() => {
    if (userSettings) setUserColor(userSettings.color_theme);
  }, [userSettings]);

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={onChange}>
      <div className="pb-2">
        <MarkButton format="bold" icon={isDark ? boldW : boldB}/>
        <MarkButton format="italic" icon={isDark ? italicW : italicB}/>
        <MarkButton format="underline" icon={isDark ? underlineW : underlineB}/>
        <MarkButton format="code" icon={isDark ? codeW : codeB}/>
        <BlockButton format="heading-one" icon={isDark ? headingOneW : headingOneB}/>
        <BlockButton format="heading-two" icon={isDark ? headingTwoW : headingTwoB}/>
        <BlockButton format="block-quote" icon={isDark ? quotesW : quotesB}/>
        <BlockButton format="numbered-list" icon={isDark ? numberedListW : numberedListB}/>
        <BlockButton format="bulleted-list" icon={isDark ? bulletListW : bulletListB}/>
        <BlockButton format="left" icon={isDark ? alignLeftW : alignLeftB}/>
        <BlockButton format="center" icon={isDark ? alignCenterW : alignCenterB}/>
        <BlockButton format="right" icon={isDark ? alignRightW : alignRightB}/>
        <BlockButton format="justify" icon={isDark ? alignJustifyW : alignJustifyB}/>
      </div>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Note content..."
        spellCheck
        autoFocus
        onKeyDown={(e) => onEditableKeyDown(e, editor)}
        className="border-2 border-slate-300 rounded-md p-2 sm:p-3 min-h-[180px] sm:min-h-[260px] md:min-h-[320px] text-sm sm:text-base focus:outline-none"
        maxLength={10000}
      />
    </Slate>
  );
};