<?php
  class Note {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
      $this->pdo = $pdo;
    }

    public function create(string $userId, string $title, string $content, bool $isArchived, array $tagIds) {
      try {
        $this->pdo->beginTransaction();

        $stmt = $this->pdo->prepare("INSERT INTO notes (user_id, title, content, is_archived) VALUES (?, ?, ?, ?)");
        $stmt->execute([$userId, $title, $content, $isArchived]);

        $noteId = $this->pdo->lastInsertId();

        if (!empty($tagIds)) {
          $tagStmt = $this->pdo->prepare("INSERT IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)");
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

    public function findAllByUser(string $userId) {
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
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(string $id, string $userId) {
      $stmt = $this->pdo->prepare("SELECT * FROM notes WHERE id = ? AND user_id = ?");
      $stmt->execute([$id, $userId]);
      return $stmt->fetch();
    }

    public function update(string $id, string $userId, string $title, string $content, bool $isArchived) {
      $stmt = $this->pdo->prepare("
        UPDATE notes
        SET title=:title, content=:content, is_archived=:is_archived
        WHERE id=:id AND user_id=:user_id
      ");
      $stmt->execute([
        'title' => $title, 
        'content' => $content, 
        'is_archived' => $isArchived, 
        'id' => $id, 
        'user_id' => $userId
      ]);
      return $stmt->rowCount();
    }

    public function delete(string $id, string $userId) {
      $stmt = $this->pdo->prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
      $stmt->execute([$id, $userId]);
      return $stmt->rowCount();
    }
  }
?>