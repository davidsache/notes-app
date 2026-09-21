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

    public function getUserSettings(string $userId) {
      $stmt = $this->pdo->prepare("SELECT color_theme, font_theme FROM user_settings WHERE user_id = ?");
      $stmt->execute([$userId]);
      return $stmt->fetch();
    }

    public function insertUserSettings(string $userId, string $color, string $font) {
      $stmt = $this->pdo->prepare("
        INSERT INTO user_settings (user_id, color_theme, font_theme)
        VALUES (:user_id, :color_theme, :font_theme)
      ");
      return $stmt->execute(["user_id" => $userId, "color_theme" => $color, "font_theme" => $font]);
    }

    public function updateUserSettings(string $userId, string $color, string $font) {
      $stmt = $this->pdo->prepare("
        UPDATE user_settings
        SET color_theme=:color_theme, font_theme=:font_theme
        WHERE user_id=:user_id
      ");
      return $stmt->execute(["color_theme" => $color, "font_theme" => $font, "user_id" => $userId]);
    }
  }
?>