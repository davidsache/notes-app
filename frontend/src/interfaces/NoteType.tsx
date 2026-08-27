export interface Note {
  id: string | number;
  title: string;
  content: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface NoteInput {
  title: string;
  content: string;
  is_archived?: boolean;
}