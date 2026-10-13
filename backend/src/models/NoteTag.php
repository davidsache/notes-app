<?php
  class NoteTag {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
      $this->pdo = $pdo;
    }

    public function verifyOwnership(int $noteId, int $tagId, int $userId): bool {
      $stmt = $this->pdo->prepare("
        SELECT
          (SELECT COUNT(*) FROM notes WHERE id = ? AND user_id = ?) as note_exists,
          (SELECT COUNT(*) FROM tags WHERE id = ? AND user_id = ?) as tag_exists
      ");
      $stmt->execute([$noteId, $userId, $tagId, $userId]);
      $result = $stmt->fetch();
      return $result["note_exists"] > 0 && $result["tag_exists"] > 0;
    }

    public function getAllNoteTags(int $noteId, int $userId): array {
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

    public function addTagToNote(int $noteId, int $tagId): bool {
      $stmt = $this->pdo->prepare("INSERT IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)");
      return $stmt->execute([$noteId, $tagId]);
    }
    
    public function deleteTagFromNote(int $noteId, int $tagId) {
      $stmt = $this->pdo->prepare("DELETE FROM note_tags WHERE note_id = ? AND tag_id = ?");
      $stmt->execute([$noteId, $tagId]);
      return $stmt->rowCount() > 0;
    }
  }
?>