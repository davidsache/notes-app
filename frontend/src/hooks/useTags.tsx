import { useCallback, useState } from "react";
import type { Tag } from "../interfaces/TagType";

const API_BASE = "http://localhost:8000/public";

export const useTags = () => {
  const [noteTags, setNoteTags] = useState<Tag[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- TAGS ---
  const fetchAllTags = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/Tags.php`, { credentials: 'include' });
      const data = await res.json();

      if (!res.ok) throw new Error('Failed to fetch user tags');
      
      if (Array.isArray(data)) setTags(data);
      else if (data && Array.isArray(data.tags)) setTags(data.tags);
      else throw new Error('Invalid data format received from server');
    }
    catch (err) {
      setTags([]);
    }
    finally {
      setIsLoading(false);
    }
  }, []);

  const addTag = async (tagName: string) => {
    await fetch(`${API_BASE}/Tags.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: tagName })
    });

    await fetchAllTags();
  }

  const deleteTag = async (id: string) => {
    await fetch(`${API_BASE}/Tags.php?tag_id=${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    setTags((prev) => prev.filter((tag) => tag.id !== id));
  }

  // --- NOTE TAGS ---
  const fetchNoteTags = useCallback(async (noteId: number | string) => {
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/NoteTags.php?note_id=${noteId}`, { credentials: 'include' });
      const data = await res.json();

      if (!res.ok) throw new Error('Failed to fetch note tags');
      
      if (Array.isArray(data)) setNoteTags(data);
      else if (data && Array.isArray(data.noteTags)) setNoteTags(data.noteTags);
      else throw new Error('Invalid data format received from server');
    }
    catch (err) {
      setNoteTags([]);
    }
    finally {
      setIsLoading(false);
    }
  }, []);

  const addNoteTag = async (noteId: string, tagId: string) => {
    await fetch(`${API_BASE}/NoteTags.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ note_id: noteId, tag_id: tagId })
    });

    await fetchNoteTags(noteId);
  }

  const deleteNoteTag = async (noteId: string, tagId: string) => {
    await fetch(`${API_BASE}/NoteTags.php?note_id=${noteId}&tag_id=${tagId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    setNoteTags((prev) => prev.filter((tag) => tag.id !== tagId));
  }

  return { noteTags, tags, isLoading, fetchAllTags, fetchNoteTags, addTag, addNoteTag, deleteTag, deleteNoteTag };
}