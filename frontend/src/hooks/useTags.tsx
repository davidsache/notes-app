import { useCallback, useState } from "react";
import type { Tag } from "../interfaces/TagType";

const API_BASE = "http://localhost:8000/public";

export const useTags = () => {
  const [noteTags, setNoteTags] = useState<Tag[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAllTags = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(`${API_BASE}/tags.php`, { credentials: 'include' });

    if (!res.ok) {
      setIsLoading(false);
      return;
    }

    const data = await res.json();
    setTags(Array.isArray(data) ? data : []);
    setIsLoading(false);
  }, []);

  const fetchNoteTags = useCallback(async (noteId: number | string) => {
    setIsLoading(true);
    const res = await fetch(`${API_BASE}/tags.php?note_id=${noteId}`, { credentials: 'include' });

    if (!res.ok) {
      setNoteTags([]);
      return;
    }

    const data = await res.json();
    setNoteTags(Array.isArray(data) ? data : []);
    setIsLoading(false);
  }, []);

  const addTag = async (tagName: string) => {
    await fetch(`${API_BASE}/tags.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: tagName })
    });

    await fetchAllTags();
  }

  const addNoteTag = async (noteId: string, tagId: string) => {
    await fetch(`${API_BASE}/tags.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ note_id: noteId, tag_id: tagId })
    });

    await fetchNoteTags(noteId);
  }

  const deleteTag = async (id: string) => {
    await fetch(`${API_BASE}/tags.php?id=${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    setTags((prev) => prev.filter((tag) => tag.id !== id));
  }

  const deleteNoteTag = async (noteId: string, tagId: string) => {
    await fetch(`${API_BASE}/tags.php?note_id=${noteId}&tag_id=${tagId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    setNoteTags((prev) => prev.filter((tag) => tag.id !== tagId));
  }

  return { noteTags, tags, isLoading, fetchAllTags, fetchNoteTags, addTag, addNoteTag, deleteTag, deleteNoteTag };
}