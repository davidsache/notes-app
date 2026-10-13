<?php
  class NoteService {
    private Note $noteModel;

    public function __construct(Note $noteModel) {
      $this->noteModel = $noteModel;
    }

    public function getUserNotes(int $userId): array {
      return $this->noteModel->getAllByUser($userId);
    }

    public function getNoteById(int $id, int $userId): array {
      $note = $this->noteModel->getById($id, $userId);

      if (!$note) {
        throw new NotFoundException("Note with ID {$id} not found");
      }

      return $note;
    }

    public function createNote(int $userId, array $data): int {
      $title = $data["title"] ?? "";
      $content = $data["content"] ?? "";
      $isArchived = !empty($data["is_archived"]) ? 1 : 0;
      $tagIds = is_array($data["tag_ids"] ?? null) ? $data["tag_ids"] : [];

      if (!$title) {
        throw new ValidationException('Validation failed', ['title' => 'Title is required.']);
      }
      if (!$content) {
        throw new ValidationException('Validation failed', ['content' => 'Content is required.']);
      }

      return $this->noteModel->createNote($userId, $title, $content, $isArchived, $tagIds);
    }

    public function updateNote(int $id, int $userId, array $data): bool {
      $existing = $this->getNoteById($id, $userId);
      $title = $data["title"] ?? $existing["title"];
      $content = $data["content"] ?? $existing["content"];
      $isArchived = $data["is_archived"] ?? $existing["is_archived"];

      if (!$title) {
        throw new ValidationException('Validation failed', ['title' => 'Title is required.']);
      }
      if (!$content) {
        throw new ValidationException('Validation failed', ['content' => 'Content is required.']);
      }

      return $this->noteModel->updateNote($id, $userId, $title, $content, $isArchived);
    }

    public function deleteNote(int $id, int $userId): bool {
      return $this->noteModel->delete($id, $userId);
    }
  }
?>