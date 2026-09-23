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

  return (
    <button onClick={available ? onAddedTag : onDeletedTag} className="me-1">
      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorStyles}`}>
        <span className="font-bold hover:text-slate-900">{available ? '+' : 'x'}</span>&nbsp;
        {tag.name}
      </div>
    </button> 
  );
}