<?php
  class Tag {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
      $this->pdo = $pdo;
    }

    public function getTag(int $id, int $userId): ?array {
      $stmt = $this->pdo->prepare("SELECT id, name WHERE id = ? AND user_id = ?");
      $stmt->execute([$id, $userId]);
      $tag = $stmt->fetch();
      return $tag ?: null; 
    }

    public function getAllTags(int $userId): array {
      $stmt = $this->pdo->prepare("SELECT id, name FROM tags WHERE user_id = ?");
      $stmt->execute([$userId]);
      return $stmt->fetchAll();
    }

    public function addTag(int $userId, string $name): int {
      $stmt = $this->pdo->prepare("INSERT INTO tags (user_id, name) VALUES (?, ?)");
      $stmt->execute([$userId, $name]);
      return (int) $this->pdo->lastInsertId();
    }

    public function deleteTag(int $id, int $userId): bool {
      $stmt = $this->pdo->prepare("DELETE FROM tags WHERE id = ? AND user_id = ?");
      $stmt->execute([$id, $userId]);
      return $stmt->rowCount() > 0;
    }
  }
?>