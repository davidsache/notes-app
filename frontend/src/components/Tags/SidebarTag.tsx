import { useTheme } from "../../context/ThemeContext";
import type { Tag } from "../../interfaces/TagType";
import { useTags } from "../../hooks/useTags";
import { useState } from "react";

import deleteB from '../../assets/delete_b.svg';
import deleteW from '../../assets/delete_w.svg';

interface SidebarTagProps {
  tag: Tag;
  refetchTags: () => void;
}

export const SidebarTag: React.FC<SidebarTagProps> = ({ tag, refetchTags }) => {
  const { darkMode } = useTheme();
  const { deleteTag } = useTags();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleDeleteTag = async () => {
    if (confirm(`Do you wish to delete the tag '${tag.name}'? It will be removed from all associated notes as well.`)) {
      setSubmitting(true);
      await deleteTag(tag.id);
      refetchTags();
    }
  }

  return (
    <div>
      <button className="align-middle" onClick={handleDeleteTag} disabled={submitting}>
        <img src={darkMode ? deleteW : deleteB} alt="Delete tag"/>
      </button>
      {tag.name}
    </div>
  );
}