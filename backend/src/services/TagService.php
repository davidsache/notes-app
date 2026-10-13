<?php
  class TagService {
    private Tag $tagModel;

    public function __construct(Tag $tagModel) {
      $this->tagModel = $tagModel;
    }

    public function getTag(int $id, int $userId) {
      $tag = $this->tagModel->getTag($id, $userId);

      if (!$tag) {
        throw new NotFoundException("Tag with ID {$id} does not exist");
      }

      return $tag;
    }

    public function getAllTags(int $userId) {
      $tags = $this->tagModel->getAllTags($userId);

      if (!$tags) {
        throw new NotFoundException("The user has no tags, or the tags couldn't be fetched");
      }

      return $tags;
    }

    public function addTag(int $userId, string $name) {
      if (!$name) {
        throw new ValidationException('Tag validation failed', ['name' => 'Tag name is required']);
      }

      $success = $this->tagModel->addTag($userId, $name);
      
      if (!$success) {
        throw new Exception('Database insertion failed', 500);
      }

      return $success;
    }

    public function deleteTag(int $id, int $userId) {
      $wasDeleted = $this->tagModel->deleteTag($id, $userId);

      if (!$wasDeleted) {
        throw new Exception('Database record deletion failed', 500);
      }

      return $wasDeleted;
    }
  }
?>