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
    <button onClick={available ? onAddedTag : onDeletedTag} className="max-w-full">
      <div className={`inline-flex items-center rounded-full px-2.5 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium max-w-full ${colorStyles}`}>
        <span className="font-bold hover:text-slate-900 shrink-0">
          {available ? '+' : 'x'}
        </span>
        &nbsp;
        <span className="truncate max-w-[140px] sm:max-w-[180px] md:max-w-[220px]">
          {tag.name}
        </span>
      </div>
    </button> 
  );
}