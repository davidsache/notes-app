import { useTheme } from "../../context/ThemeContext";
import type { Tag } from "../../interfaces/TagType";

import labelB from '../../assets/label_b.svg';
import labelW from '../../assets/label_w.svg';

interface SidebarTagProps {
  tag: Tag;
  tagToFilterBy: (tag: Tag) => void;
}

export const SidebarTag: React.FC<SidebarTagProps> = ({ tag, tagToFilterBy }) => {
  const { darkMode } = useTheme();

  return (
    <div className="w-auto md:w-full">
      <button 
        className="w-full flex items-center text-left text-xs sm:text-sm md:text-base py-1 px-2 md:px-1 rounded hover:text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors min-w-0" 
        onClick={() => tagToFilterBy(tag)}
      >
        <img className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 me-1.5 shrink-0" src={darkMode ? labelW : labelB} alt="Access tag"/>
        <span className="truncate">{tag.name}</span>
      </button>
    </div>
  );
}