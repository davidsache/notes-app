import type { Tag } from "./TagType";

export interface SidebarProps {
  changeNotesView: (newView: 'allNotes' | 'archivedNotes' | 'settings') => void;
  filterByTag: (tag: Tag) => void;
}

export interface SidebarHandler {
  refetchTags: () => void;
}