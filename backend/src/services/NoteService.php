<?php
  class NoteService {
    private Note $noteModel;

    public function __construct(Note $noteModel) {
      $this->noteModel = $noteModel;
    }

    public function createNote(string $userId, mixed $data) {
      $title = $data["title"] ?? "";
      $content = $data["content"] ?? "";
      $isArchived = isset($data["is_archived"]) && $data["is_archived"] ? 1 : 0;
      $tagIds = $data["tag_ids"] ?? [];

      return $this->noteModel->create($userId, $title, $content, $isArchived, $tagIds);
    }

    public function getUserNotes(string $userId) {
      return $this->noteModel->findAllByUser($userId);
    }

    public function getNoteById(string $id, string $userId) {
      $note = $this->noteModel->findById($id, $userId);

      if (!$note) {
        throw new Exception("Note not found or unauthorized.", 404);
      }
      
      return $note;
    }

    public function updateNote(string $id, string $userId, mixed $data) {
      $existing = $this->getNoteById($id, $userId);

      $title = $data["title"] ?? $existing["title"];
      $content = $data["content"] ?? $existing["content"];
      $isArchived = $data["is_archived"] ?? $existing["is_archived"];

      $success = $this->noteModel->update($id, $userId, $title, $content, $isArchived);

      if ($success) {
        return $this->noteModel->findById($id, $userId);
      }

      throw new Exception("Failed to update note.");
    }

    public function deleteNote(string $id, string $userId) {
      if (!$this->noteModel->delete($id, $userId)) {
        throw new Exception("Failed to delete note or note not found.", 404);
      }

      return true;
    }
  }
?>