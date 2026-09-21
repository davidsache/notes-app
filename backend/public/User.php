<?php
  require_once __DIR__ . "/../config/Cors.php";
  require_once __DIR__ . "/../config/Database.php";

  if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
  }

  $userId = $_SESSION["user_id"];
  $method = $_SERVER["REQUEST_METHOD"];

  $userModel = new User($pdo);
  $userService = new UserService($userModel);
  $userController = new UserController($userService);

  $userController->handleRequest($userId, $method);
?>