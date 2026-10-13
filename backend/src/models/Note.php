<?php
  class Note {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
      $this->pdo = $pdo;
    }

    public function getAllByUser(int $userId): array {
      $stmt = $this->pdo->prepare('
        SELECT n.id, n.title, n.content, n.is_archived, n.created_at, n.updated_at,
          GROUP_CONCAT(t.name SEPARATOR ", ") as tag_names
        FROM notes n
        LEFT JOIN note_tags nt ON n.id = nt.note_id
        LEFT JOIN tags t ON nt.tag_id = t.id
        WHERE n.user_id = ?
        GROUP BY n.id
        ORDER BY n.created_at DESC
      ');
      $stmt->execute([$userId]);
      return $stmt->fetchAll();
    }

    public function getById(int $id, int $userId): ?array {
      $stmt = $this->pdo->prepare("SELECT * FROM notes WHERE id = ? AND user_id = ?");
      $stmt->execute([$id, $userId]);
      $note = $stmt->fetch();
      return $note ?: null;
    }

    public function createNote(int $userId, string $title, string $content, bool $isArchived, array|null $tagIds): int {
      try {
        $this->pdo->beginTransaction();

        $stmt = $this->pdo->prepare("INSERT INTO notes (user_id, title, content, is_archived) VALUES (?, ?, ?, ?)");
        $stmt->execute([$userId, $title, $content, $isArchived]);
        $noteId = (int) $this->pdo->lastInsertId();

        if ($tagIds && !empty($tagIds)) {
          $tagStmt = $this->pdo->prepare("
            INSERT IGNORE INTO note_tags (note_id, tag_id) 
            SELECT ?, t.id FROM tags t WHERE t.id = ? AND t.user_id = ?
          ");

          foreach ($tagIds as $tagId) {
            $tagStmt->execute([$noteId, $tagId]);
          }
        }

        $this->pdo->commit();
        return $noteId;
      }
      catch (PDOException $e) {
        $this->pdo->rollBack();
        throw $e;
      }
    }

    public function updateNote(int $id, int $userId, string $title, string $content, bool $isArchived): bool {
      $stmt = $this->pdo->prepare("
        UPDATE notes SET title = :title, content = :content, is_archived = :is_archived
        WHERE id = :id AND user_id = :user_id
      ");

      $success = $stmt->execute([
        ':title' => $title, 
        ':content' => $content, 
        ':is_archived' => $isArchived, 
        ':id' => $id, 
        ':user_id' => $userId
      ]);

      if ($success) {
        return $stmt->rowCount() > 0;
      }

      return false;
    }

    public function delete(int $id, int $userId): bool {
      $stmt = $this->pdo->prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
      $stmt->execute([$id, $userId]);
      return $stmt->rowCount() > 0;
    }
  }
?>