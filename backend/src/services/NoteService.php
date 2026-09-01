<?php
  class NoteService {
    private Note $noteModel;

    public function __construct(Note $noteModel) {
      $this->noteModel = $noteModel;
    }

    public function createNote(string $userId, $data) {
      if (!isset($data["title"]) || !isset($data["content"])) {
        throw new Exception("Title and content are required");
      }

      $isArchived = isset($data["is_archived"]) ? (int)$data["is_archived"] : 0;
      return $this->noteModel->create($userId, $data["title"], $data["content"], $isArchived);
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