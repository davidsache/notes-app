import { useEffect, useState } from "react";
import type { Tag } from "../../interfaces/TagType";

interface TagBadgeProps {
  tag: Tag;
  available: boolean;
  onAddedTag: () => void;
  onDeletedTag: () => void;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, available, onAddedTag, onDeletedTag }) => {
  const [colorStyles, setColorStyles] = useState<string>('');

  useEffect(() => {
    if (available) {
      setColorStyles('bg-blue-100 text-blue-800');
    }
    else {
      setColorStyles('bg-green-100 text-green-800');
    }
  }, []);

  const addTagNote = () => {
    console.log('add:', tag)
    onAddedTag();
  }

  const deleteTagNote = () => {
    console.log('delete:', tag)
    onDeletedTag();
  }

  return (
    <div>
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorStyles}`}>
        {available 
          ? <button onClick={addTagNote} className="font-bold me-1 hover:text-slate-900">+</button> 
          : <button onClick={deleteTagNote} className="font-bold me-1 hover:text-slate-900">x</button>
        } 
        {tag.name}
      </span>
    </div>
  )
}