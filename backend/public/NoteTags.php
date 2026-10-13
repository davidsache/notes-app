<?php
  require_once __DIR__ . '/../config/cors.php';
  require_once __DIR__ . '/../config/database.php';

  if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
  }

  $userId = (int) $_SESSION["user_id"];
  $method = (string) $_SERVER["REQUEST_METHOD"];

  $noteTagModel = new NoteTag($pdo);
  $noteTagService = new NoteTagService($noteTagModel);
  $noteTagController = new NoteTagController($noteTagService);

  $noteTagController->handleRequest($method, $userId);
?>