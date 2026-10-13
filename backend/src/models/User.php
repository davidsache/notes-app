<?php
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\Exception;

  class User {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
      $this->pdo = $pdo;
    }

    public function getByEmail(string $email): ?array {
      $stmt = $this->pdo->prepare("SELECT id, email, username, password_hash FROM users WHERE email = ?");
      $stmt->execute([$email]);
      $user = $stmt->fetch();
      return $user ?: null;
    }

    public function getById(int $id): ?array {
      $stmt = $this->pdo->prepare("SELECT email, username, password_hash FROM users WHERE id = ?");
      $stmt->execute([$id]);
      $user = $stmt->fetch();
      return $user ?: null;
    }

    public function signUp(string $email, string $username, string $password): int {
      $stmt = $this->pdo->prepare("INSERT INTO users (email, username, password_hash) VALUES (:email, :username, :password_hash)");
      $stmt->execute(["email" => $email, "username" => $username, "password_hash" => $password]);
      return (int) $this->pdo->lastInsertId();
    }

    public function getUserSettings(int $userId): ?array {
      $stmt = $this->pdo->prepare("SELECT color_theme, font_theme FROM user_settings WHERE user_id = ?");
      $stmt->execute([$userId]);
      $userSettings = $stmt->fetch();
      return $userSettings ?: null;
    }

    public function insertUserSettings(int $userId, string $color, string $font): int {
      $stmt = $this->pdo->prepare("
        INSERT INTO user_settings (user_id, color_theme, font_theme)
        VALUES (:user_id, :color_theme, :font_theme)
      ");
      $stmt->execute(["user_id" => $userId, "color_theme" => $color, "font_theme" => $font]);
      return (int) $this->pdo->lastInsertId();
    }

    public function updateUserSettings(int $userId, string $color, string $font): bool {
      $stmt = $this->pdo->prepare("
        UPDATE user_settings
        SET color_theme=:color_theme, font_theme=:font_theme
        WHERE user_id=:user_id
      ");
      $stmt->execute(["color_theme" => $color, "font_theme" => $font, "user_id" => $userId]);
      return $stmt->rowCount() > 0;
    }

    public function resetPasswordRequest(int $userId, string $email) {
      $token = bin2hex(random_bytes(32));

      $hashedToken = hash('sha256', $token);
      $expires = date("Y-m-d H:i:s", strtotime('+1 hour'));
      $currentDate = date("Y-m-d H:i:s");

      $stmt = $this->pdo->prepare("DELETE FROM password_resets WHERE user_id = ?");
      $stmt->execute([$userId]);

      $stmt = $this->pdo->prepare("
        INSERT INTO password_resets (user_id, token_hash, expires_at, created_at)
        VALUES (:user_id, :token_hash, :expires_at, :created_at)
      ");
      $result = $stmt->execute([
        "user_id" => $userId, 
        "token_hash" => $hashedToken, 
        "expires_at" => $expires, 
        "created_at" => $currentDate
      ]);

      if (!$result) {
        return false;
      }
      
      $mail = new PHPMailer(true);

      try {
        $mail->isSMTP();

        $mail->Host = '127.0.0.1';
        $mail->SMTPAuth = false;
        $mail->Port = 1025;
        
        $mail->setFrom("noreply@localhost.com", "Notes App");
        $mail->addAddress($email);

        $resetLink = "http://localhost:5173/newPassword?token=" . $token;

        $mail->isHTML(true);
        $mail->Subject = "Password Reset Request";
        $mail->Body = 'To reset your password, click this link (valid for 1 hour): <br/><br/> <a href="' . $resetLink . '">' . $resetLink . '</a>';
        $mail->AltBody = "To reset your password, copy and paste this link into your browser: " . $resetLink;

        $mail->send();
        return true;
      }
      catch (Exception $e) {
        return $e;
      }
    }

    public function getPasswordResetRequest(string $token): ?array {
      $hashedToken = hash('sha256', $token);
      $stmt = $this->pdo->prepare("SELECT user_id, expires_at, created_at FROM password_resets WHERE token_hash = ?");
      $stmt->execute([$hashedToken]);

      $request = $stmt->fetch();
      return $request ?: null;
    }

    public function changePassword(int $userId, string $password): bool {
      $stmt = $this->pdo->prepare("UPDATE users SET password_hash=:password_hash, updated_at=:updated_at WHERE id=:id");
      $success = $stmt->execute([
        "password_hash" => $password, 
        "updated_at" => date("Y-m-d H:i:s"), 
        "id" => $userId
      ]);

      $stmt = $this->pdo->prepare("DELETE FROM password_resets WHERE user_id = ?");
      $stmt->execute([$userId]);
      
      return $success;
    }
  }
?>