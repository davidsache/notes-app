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

    public function handleResetRequest() {
      $input = json_decode(file_get_contents("php://input"), true);
      $email = $input["email"] ?? "";
      $token = $input["token"] ?? "";

      if ($email) {
        $success = $this->authService->resetPasswordRequest($email);
        echo json_encode(["success" => $success]);
        return;
      }
      else if ($token) {
        $request = $this->authService->getPasswordResetRequest($token);

        if ($request) {
          echo json_encode(["request" => $request]);
        }
        else {
          http_response_code(400);
          echo json_encode(["error" => "Request could not be fetched."]);
        }

        return;
      }
      else {
        http_response_code(400);
        echo json_encode(["error" => "Email or token is required"]);
        return;
      }
    }

    public function changePassword() {
      $input = json_decode(file_get_contents("php://input"), true);
      $password = $input["password"];
      $userId = $input["user_id"];

      if (!$password || !$userId) {
        http_response_code(400);
        echo json_encode(["error" => "The required data was not provided."]);
        return;
      }

      $passwordHash = password_hash($password, PASSWORD_DEFAULT);
      $success = $this->authService->changePassword($userId, $passwordHash);
      echo json_encode(["success" => $success]);
    }
  }
?>