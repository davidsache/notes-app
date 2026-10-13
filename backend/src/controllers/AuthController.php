<?php
  require_once __DIR__ . "/../services/AuthService.php";
  require_once __DIR__ . "/BaseController.php";

  class AuthController extends BaseController {
    private AuthService $authService;

    public function __construct(AuthService $authService) {
      $this->authService = $authService;
    }

    public function login() {
      $input = json_decode(file_get_contents("php://input"), true) ?? [];
      $email = (string) $input["email"] ?? "";
      $password = (string) $input["password"] ?? "";

      try {
        $user = $this->authService->authenticate($email, $password);
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["email"] = $user["email"];
        $_SESSION["username"] = $user["username"];
        $this->json(['user' => $user]);
      } 
      catch (ValidationException $e) {
        $this->error($e->getMessage(), 422, $e->getErrors());
      } 
      catch (UnauthorizedException $e) {
        $this->error($e->getMessage(), 401);
      } 
      catch (Exception $e) {
        $this->error('An error occurred during authentication.', 500);
      }
    }

    public function checkAuth() {
      if (!isset($_SESSION["user_id"])) {
        $this->error('Not authenticated', 401);
      }

      $user = new stdClass();
      $user->username = (string) $_SESSION["username"] ?? "";
      $user->email = (string) $_SESSION["email"] ?? "";

      $this->json(["authenticated" => true, "user" => $user]);
    }

    public function signup() {
      $input = json_decode(file_get_contents("php://input"), true) ?? [];
      $email = (string) $input["email"] ?? "";
      $username = (string) $input["username"] ?? "";
      $password = (string) $input["password"] ?? "";

      try {
        $userId = $this->authService->signUp($email, $username, $password);
        $this->json(["success" => $userId ? true : false], $userId ? 201 : 500);
      } 
      catch (ValidationException $e) {
        $this->error($e->getMessage(), 422, $e->getErrors());
      } 
      catch (ConflictException $e) {
        $this->error($e->getMessage(), 409);
      } 
      catch (Exception $e) {
        $this->error('An error occurred during registration.', 500);
      }
    }

    public function logout() {
      $_SESSION = [];

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
      $this->json(['success' => true]);
    }

    public function handleResetRequest() {
      $input = json_decode(file_get_contents("php://input"), true) ?? [];
      $email = (string) $input["email"] ?? "";
      $token = (string) $input["token"] ?? "";

      try {
        if ($email) {
          $result = $this->authService->resetPasswordRequest($email);
          $this->json(["success" => $result]);
        }
        else if ($token) {
          $request = $this->authService->getPasswordResetRequest($token);
          $this->json(["request" => $request]);
        }
        else {
          $this->error("Invalid operation.", 400, ["Email or token parameter are required."]);
        }
      }
      catch (ValidationException $e) {
        $this->error($e->getMessage(), 422, $e->getErrors());
      }
      catch (NotFoundException $e) {
        $this->error($e->getMessage(), 404);
      }
      catch (Exception $e) {
        $this->error($e->getMessage(), $e->getCode());
      }
    }

    public function changePassword() {
      $input = json_decode(file_get_contents('php://input'), true) ?? [];
      $userId = (int) $input["user_id"] ?? null;
      $password = (string) $input["password"] ?? "";
      
      try {
        $this->authService->changePassword($userId, $password);
        $this->json(['success' => true, 'message' => 'Password changed successfully.']);
      } 
      catch (ValidationException $e) {
        $this->error($e->getMessage(), 422, $e->getErrors());
      } 
      catch (NotFoundException $e) {
        $this->error($e->getMessage(), 404);
      } 
      catch (Exception $e) {
        $this->error('An error occurred while changing the password.', 500);
      }
    }
  }
?>