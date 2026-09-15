<?php
  class Tag {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
      $this->pdo = $pdo;
    }

    public function addTag(string $userId, string $name) {
      $stmt = $this->pdo->prepare("INSERT INTO tags (user_id, name) VALUES (?, ?)");
      return $stmt->execute([$userId, $name]);
    }

    public function getTag(string $id, string $userId) {
      $stmt = $this->pdo->prepare("SELECT id, name WHERE id = ? AND user_id = ?");
      $stmt->execute([$id, $userId]);
      return $stmt->fetch();
    }

    public function addTagToNote(string $noteId, string $tagId, string $userId) {
      $check = $this->pdo->prepare("SELECT id FROM notes WHERE id = ? AND user_id = ?");
      $check->execute([$noteId, $userId]);
      if (!$check->fetch()) {
        return false;
      }

      $stmt = $this->pdo->prepare("INSERT IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)");
      return $stmt->execute([$noteId, $tagId]);
    }

    public function deleteTagFromNote(string $noteId, string $tagId, string $userId) {
      $check = $this->pdo->prepare("SELECT id FROM notes WHERE id = ? AND user_id = ?");
      $check->execute([$noteId, $userId]);
      if (!$check->fetch()) {
        return false;
      }

      $stmt = $this->pdo->prepare("DELETE FROM note_tags WHERE note_id = ? AND tag_id = ?");
      return $stmt->execute([$noteId, $tagId]);
    }

    public function getAllNoteTags(string $noteId, string $userId) {
      $stmt = $this->pdo->prepare("
        SELECT t.id, t.name
        FROM tags t
        INNER JOIN note_tags nt ON t.id = nt.tag_id
        INNER JOIN notes n ON nt.note_id = n.id
        WHERE nt.note_id = ? AND n.user_id = ?
      ");
      $stmt->execute([$noteId, $userId]);
      return $stmt->fetchAll();
    }

    public function getAllTags() {
      $stmt = $this->pdo->prepare("SELECT id, name FROM tags");
      $stmt->execute();
      return $stmt->fetchAll();
    }

    public function deleteTag(string $id, string $userId) {
      $stmt = $this->pdo->prepare("DELETE FROM tags WHERE id = ? AND user_id = ?");
      return $stmt->execute([$id, $userId]);
    }
  }
?>