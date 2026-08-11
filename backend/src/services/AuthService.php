<?php
  class AuthService {
    private User $userModel;

    public function __construct(User $userModel) {
      $this->userModel = $userModel;
    }

    public function authenticate(string $email, string $password) {
      $user = $this->userModel->findByEmail($email);

      if ($user && password_verify($password, $user["password_hash"])) {
        session_regenerate_id(true);
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["email"] = $user["email"];

        return [
          "email" => $user["email"],
          "username" => $user["username"]
        ];
      }

      return false;
    }

    public function getStatus() {
      if (isset($_SESSION["user_id"])) {
        return [
          "id" => $_SESSION["user_id"],
          "email" => $_SESSION["email"]
        ];
      }

      return false;
    }

    public function signUp(string $email, string $username, string $password) {
      return $this->userModel->signUp($email, $username, $password);
    }

    public function terminate() {
      $_SESSION = array();

      if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
          session_name(),
          "",
          time() - 42000,
          $params["path"],
          $params["domain"],
          $params["secure"],
          $params["httponly"]
        );
      }

      session_destroy();
    }
  }
?>