<?php
  class Note {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
      $this->pdo = $pdo;
    }

    public function create(string $userId, string $title, string $content, bool $isArchived) {
      $stmt = $this->pdo->prepare("
        INSERT INTO notes (user_id, title, content, is_archived)
        VALUES (?, ?, ?, ?)
      ");
      $stmt->execute([$userId, $title, $content, $isArchived]);
      return $this->findById($this->pdo->lastInsertId(), $userId);
    }

    public function findAllByUser(string $userId) {
      $stmt = $this->pdo->prepare("
        SELECT id, title, content, is_archived, created_at, updated_at FROM notes 
        WHERE user_id = ? ORDER BY created_at DESC
      ");
      $stmt->execute([$userId]);
      return $stmt->fetchAll();
    }

    public function findById(string $id, string $userId) {
      $stmt = $this->pdo->prepare("SELECT * FROM notes WHERE id = ? AND user_id = ?");
      $stmt->execute([$id, $userId]);
      return $stmt->fetch();
    }

    public function update(string $id, string $userId, string $title, string $content, string $isArchived) {
      $stmt = $this->pdo->prepare("
        UPDATE notes
        SET title = ?, content = ?, is_archived = ?
        WHERE id = ? AND user_id = ?
      ");
      $stmt->execute([$title, $content, $isArchived, $id, $userId]);
      return $stmt->rowCount() > 0;
    }

    public function delete(string $id, string $userId) {
      $stmt = $this->pdo->prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
      $stmt->execute([$id, $userId]);
      return $stmt->rowCount() > 0;
    }
  }
?>