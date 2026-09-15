<?php
  require_once __DIR__ . '/../config/cors.php';
  require_once __DIR__ . '/../config/database.php';

  if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
  }

  $userId = $_SESSION["user_id"];
  $method = $_SERVER["REQUEST_METHOD"];

  $tagModel = new Tag($pdo);
  $tagService = new TagService($tagModel);
  $tagController = new TagController($tagService);

  $tagController->handleRequest($method, $userId);
?>