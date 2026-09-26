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
    <div>
      <button className="align-middle hover:text-slate-500" onClick={() => tagToFilterBy(tag)}>
        <img className="inline pe-1" src={darkMode ? labelW : labelB} alt="Access tag"/>
        {tag.name}
      </button>
    </div>
  );
}