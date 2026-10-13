<?php
  require_once __DIR__ . "/../config/Cors.php";
  require_once __DIR__ . "/../config/Database.php";

  if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
  }

  $userModel = new User($pdo);
  $authService = new AuthService($userModel);
  $controller = new AuthController($authService);

  $controller->checkAuth();
?>