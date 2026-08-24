import React, { useCallback, useMemo } from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate, ReactEditor } from 'slate-react';
import { Editor, Transforms, createEditor, type Descendant, Element as SlateElement, type BaseEditor } from 'slate';
import { withHistory, HistoryEditor } from 'slate-history';
import { useTheme } from '../context/ThemeContext';

import boldB from '../assets/slate/bold_b.svg';
import boldW from '../assets/slate/bold_w.svg';
import italicB from '../assets/slate/italic_b.svg';
import italicW from '../assets/slate/italic_w.svg';
import underlineB from '../assets/slate/underline_b.svg';
import underlineW from '../assets/slate/underline_w.svg';
import codeB from '../assets/slate/code_b.svg';
import codeW from '../assets/slate/code_w.svg';
import headingOneB from '../assets/slate/heading_one_b.svg';
import headingOneW from '../assets/slate/heading_one_w.svg';
import headingTwoB from '../assets/slate/heading_two_b.svg';
import headingTwoW from '../assets/slate/heading_two_w.svg';
import quotesB from '../assets/slate/quotes_b.svg';
import quotesW from '../assets/slate/quotes_w.svg';
import numberedListB from '../assets/slate/numbered_list_b.svg';
import numberedListW from '../assets/slate/numbered_list_w.svg';
import bulletListB from '../assets/slate/bullet_list_b.svg';
import bulletListW from '../assets/slate/bullet_list_w.svg';
import alignLeftB from '../assets/slate/align_left_b.svg';
import alignLeftW from '../assets/slate/align_left_w.svg';
import alignRightB from '../assets/slate/align_right_b.svg';
import alignRightW from '../assets/slate/align_right_w.svg';
import alignCenterB from '../assets/slate/align_center_b.svg';
import alignCenterW from '../assets/slate/align_center_w.svg';
import alignJustifyB from '../assets/slate/align_justify_b.svg';
import alignJustifyW from '../assets/slate/align_justify_w.svg';

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

// Components
const Element = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'block-quote': 
      return <blockquote style={style} className="italic font-medium leading-relaxed" {...attributes}>"{children}"</blockquote>;
    case 'bulleted-list': 
      return <ul style={style} className="list-disc pl-5" {...attributes}>{children}</ul>;
    case 'heading-one': 
      return <h1 style={style} className="text-4xl font-bold" {...attributes}>{children}</h1>;
    case 'heading-two': 
      return <h2 style={style} className="text-3xl font-bold" {...attributes}>{children}</h2>;
    case 'list-item': 
      return <li style={style} {...attributes}>{children}</li>;
    case 'numbered-list': 
      return <ol style={style} className="list-decimal pl-5" {...attributes}>{children}</ol>;
    default: 
      return <p style={style} {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.code) children = <code>{children}</code>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }: { format: BlockType | string; icon: string }) => {
  const editor = useSlate();
  const active = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  );
  // { color: active ? 'black' : '#ccc', margin: '0 4px' }
  return (
    <button
      className="my-0 mx-1"
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
      style={{ color: active ? 'black' : '#ccc', margin: '0 4px' }}
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

interface RichTextProps {
  initialValue: Descendant[];
  onChange: (value: Descendant[]) => void;
}

export const CreateNote = ({ initialValue, onChange }: RichTextProps) => {
  const { darkMode } = useTheme();
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={onChange}>
      <div className="pb-5">
        <MarkButton format="bold" icon={darkMode ? boldW : boldB}/>
        <MarkButton format="italic" icon={darkMode ? italicW : italicB}/>
        <MarkButton format="underline" icon={darkMode ? underlineW : underlineB}/>
        <MarkButton format="code" icon={darkMode ? codeW : codeB}/>
        <BlockButton format="heading-one" icon={darkMode ? headingOneW : headingOneB}/>
        <BlockButton format="heading-two" icon={darkMode ? headingTwoW : headingTwoB}/>
        <BlockButton format="block-quote" icon={darkMode ? quotesW : quotesB}/>
        <BlockButton format="numbered-list" icon={darkMode ? numberedListW : numberedListB}/>
        <BlockButton format="bulleted-list" icon={darkMode ? bulletListW : bulletListB}/>
        <BlockButton format="left" icon={darkMode ? alignLeftW : alignLeftB}/>
        <BlockButton format="center" icon={darkMode ? alignCenterW : alignCenterB}/>
        <BlockButton format="right" icon={darkMode ? alignRightW : alignRightB}/>
        <BlockButton format="justify" icon={darkMode ? alignJustifyW : alignJustifyB}/>
      </div>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Note content..."
        spellCheck
        autoFocus
        onKeyDown={(e) => onEditableKeyDown(e, editor)}
        className="border-2 border-slate-300 rounded-md p-2"
        maxLength={10000}
      />
    </Slate>
  );
};