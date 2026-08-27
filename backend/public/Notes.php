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

  $noteModel = new Note($pdo);
  $noteService = new NoteService($noteModel);
  $controller = new NoteController($noteService);

  $controller->handleRequest($method, $userId);
?>