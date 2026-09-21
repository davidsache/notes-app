<?php
  require_once __DIR__ . "/../services/UserService.php";

  class UserController {
    private UserService $userService;

    public function __construct(UserService $userService) {
      $this->userService = $userService;
    }

    public function handleRequest(string $userId, string $method) {
      switch ($method) {
        case 'GET':
          $this->getUserSettings($userId);
          break;
        case 'POST':
          $this->insertUserSettings($userId);
          break;
        case 'PUT':
          $this->updateUserSettings($userId);
          break;
        default:
          http_response_code(405);
          echo json_encode(["error" => "Method not allowed"]);
          break;
      }
    }

    public function getUserSettings(string $userId) {
      $settings = $this->userService->getUserSettings($userId);

      if (!$settings) {
        http_response_code(404);
        echo json_encode(["error" => "User settings not found"]);
        return;
      }

      http_response_code(201);
      echo json_encode($settings);
      return;
    }

    public function insertUserSettings(string $userId) {
      $input = json_decode(file_get_contents("php://input"), true);
      $color = $input["color_theme"] ?? null;
      $font = $input["font_theme"] ?? null;

      if (!$color || !$font) {
        http_response_code(400);
        echo json_encode(["error" => "Color and font are required"]);
        return;
      }

      $success = $this->userService->insertUserSettings($userId, $color, $font);
      echo json_encode(["success" => $success]);
      return;
    }

    public function updateUserSettings(string $userId) {
      $input = json_decode(file_get_contents("php://input"), true);
      $color = $input["color_theme"] ?? null;
      $font = $input["font_theme"] ?? null;

      if (!$color || !$font) {
        http_response_code(400);
        echo json_encode(["error" => "Color and font are required"]);
        return;
      }

      $success = $this->userService->updateUserSettings($userId, $color, $font);
      echo json_encode(["success" => $success]);
      return;
    }
  }
?>