<?php
  class NoteTagService {
    private NoteTag $noteTagModel;

    public function __construct(NoteTag $noteTagModel) {
      $this->noteTagModel = $noteTagModel;
    }

    public function getNoteTags(int $noteId, int $userId): array {
      return $this->noteTagModel->getAllNoteTags($noteId, $userId);
    }

    public function addNoteTag(int $noteId, int $tagId, int $userId): bool {
      if (!$this->noteTagModel->verifyOwnership($noteId, $tagId, $userId)) {
        throw new NotFoundException('Note or Tag not found, or access denied.');
      }

      $success = $this->noteTagModel->addTagToNote($noteId, $tagId);
      if (!$success) {
        throw new Exception('Failed to add tag to note', 500);
      }

      return true;
    }

    public function deleteNoteTag(int $noteId, int $tagId, int $userId): bool {
      if (!$this->noteTagModel->verifyOwnership($noteId, $tagId, $userId)) {
        throw new NotFoundException('Note or Tag not found, or access denied.');
      }

      $wasDeleted = $this->noteTagModel->deleteTagFromNote($noteId, $tagId);
      if (!$wasDeleted) {
        throw new NotFoundException('Specified association does not exist.');
      }

      return true;
    }
  }
?>