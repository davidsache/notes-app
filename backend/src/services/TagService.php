<?php
  class TagService {
    private Tag $tagModel;

    public function __construct(Tag $tagModel) {
      $this->tagModel = $tagModel;
    }

    public function getTag(string $id, string $userId) {
      return $this->tagModel->getTag($id, $userId);
    }

    public function addTag(string $userId, string $name) {
      if (!$name) throw new Exception("Tag name is required.");
      return $this->tagModel->addTag($userId, $name);
    }

    public function getNoteTags(string $noteId, string $userId) {
      return $this->tagModel->getAllNoteTags($noteId, $userId);
    }

    public function addNoteTag(string $noteId, string $tagId, string $userId) {
      return $this->tagModel->addTagToNote($noteId, $tagId, $userId);
    }

    public function deleteNoteTag(string $noteId, string $tagId, string $userId) {
      return $this->tagModel->deleteTagFromNote($noteId, $tagId, $userId);
    }

    public function getAllTags() {
      return $this->tagModel->getAllTags();
    }

    public function deleteTag(string $id, string $userId) {
      return $this->tagModel->deleteTag($id, $userId);
    }
  }
?>