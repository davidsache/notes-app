<?php
  require_once __DIR__ . "/../services/AuthService.php";

  class AuthController {
    private AuthService $authService;

    public function __construct(AuthService $authService) {
      $this->authService = $authService;
    }

    public function login() {
      $input = json_decode(file_get_contents("php://input"), true);
      $email = $input["email"] ?? "";
      $password = $input["password"] ?? "";

      if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(["error" => "Email and password are required"]);
        return;
      }
      
      $user = $this->authService->authenticate($email, $password);

      if ($user) {
        echo json_encode(["user" => $user]);
      }
      else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials"]);
      }
    }

    public function check() {
      $user = $this->authService->getStatus();

      if ($user) {
        echo json_encode(["authenticated" => true, "user" => $user]);
      }
      else {
        http_response_code(401);
        echo json_encode(["authenticated" => false]);
      }
    }

    public function signup() {
      $input = json_decode(file_get_contents("php://input"), true);
      $email = $input["email"];
      $username = $input["username"];
      $password = password_hash($input["password"], PASSWORD_DEFAULT);

      if (empty($email) || empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(["error" => "Email, username and password are required"]);
        return;
      }

      $success = $this->authService->signUp($email, $username, $password);

      if ($success) {  
        echo json_encode(["success" => "Sign up was successful"]);
      }
      else {
        http_response_code(400);
        echo json_encode(["error" => "Sign up wasn't successful"]);
      }
    }

    public function logout() {
      $this->authService->terminate();
      echo json_encode(["success" => true]);
    }
  }
?>