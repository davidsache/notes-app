<?php
  class User {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
      $this->pdo = $pdo;
    }

    public function findByEmail(string $email) {
      $stmt = $this->pdo->prepare("SELECT id, email, username, password_hash FROM users WHERE email = ?");
      $stmt->execute([$email]);
      return $stmt->fetch();
    }

    public function signUp(string $email, string $username, string $password) {
      $stmt = $this->pdo->prepare("INSERT INTO users (email, username, password_hash) VALUES (:email, :username, :password_hash)");
      $stmt->execute(["email" => $email, "username" => $username, "password_hash" => $password]);
      return $this->pdo->lastInsertId();
    }
  }
?>