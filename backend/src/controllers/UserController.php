<?php
  require_once __DIR__ . "/../services/UserService.php";
  require_once __DIR__ . "/BaseController.php";

  class UserController extends BaseController {
    private UserService $userService;

    public function __construct(UserService $userService) {
      $this->userService = $userService;
    }

    public function handleRequest(int $userId, string $method) {
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
          $this->error('Method not allowed', 405);
      }
    }

    public function getUserSettings(int $userId) {
      try {
        $settings = $this->userService->getUserSettings($userId);
        $this->json(['settings' => $settings]);
      }
      catch (NotFoundException $e) {
        $this->error($e->getMessage(), 404);
      }
      catch (Exception $e) {
        $this->error($e->getMessage(), $e->getCode());
      }
    }

    public function insertUserSettings(int $userId) {
      $input = json_decode(file_get_contents("php://input"), true) ?? [];
      $color = (string) $input["color_theme"] ?? "";
      $font = (string) $input["font_theme"] ?? "";

      if (!$color) {
        $this->error('Color is required', 400);
      }
      if (!$font) {
        $this->error('Font is required', 400);
      }

      try {
        $success = $this->userService->insertUserSettings($userId, $color, $font);
        $this->json(['success' => $success ? true : false], $success ? 201 : 500);
      }
      catch (Exception $e) {
        $this->error($e->getMessage(), $e->getCode());
      }
    }

    public function updateUserSettings(int $userId) {
      $input = json_decode(file_get_contents("php://input"), true) ?? [];
      $color = (string) $input["color_theme"] ?? "";
      $font = (string) $input["font_theme"] ?? "";

      if (!$color) {
        $this->error('Color is required', 400);
      }
      if (!$font) {
        $this->error('Font is required', 400);
      }

      try {
        $success = $this->userService->updateUserSettings($userId, $color, $font);
        $this->json(['success' => $success]);
      }
      catch (Exception $e) {
        $this->error($e->getMessage(), $e->getCode());
      }
    }
  }
?>