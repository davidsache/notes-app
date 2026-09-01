import { useCallback, useState } from "react";
import type { Note, NoteInput } from "../interfaces/NoteType";

const API_BASE = "http://localhost:8000/public";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const res = await fetch(`${API_BASE}/notes.php`, { credentials: 'include' });
      const data = await res.json();

      if (!res.ok) throw new Error('Failed to fetch notes');

      if (Array.isArray(data)) {
        setNotes(data);
      }
      else if (data && Array.isArray(data.notes)) {
        setNotes(data.notes);
      }
      else {
        setNotes([]);
        throw new Error('Invalid data format received from server');
      }
    }
    catch (err) {
      if (err instanceof Error) setError(err.message);
      setNotes([]);
    }
    finally {
      setIsLoading(false);
    }
  }, []);

  const createNote = async (note: NoteInput) => {
    const res = await fetch(`${API_BASE}/notes.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(note)
    });

    if (!res.ok) throw new Error('Failed to create note');
  };

  const updateNote = async (id: number | string, note: NoteInput) => {
    const res = await fetch(`${API_BASE}/notes.php?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(note)
    });

    if (!res.ok) throw new Error('Failed to update note');
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const deleteNote = async (id: number | string) => {
    const res = await fetch(`${API_BASE}/notes.php?id=${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (!res.ok) throw new Error('Failed to delete note');
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return { notes, isLoading, error, fetchNotes, createNote, updateNote, deleteNote };
}