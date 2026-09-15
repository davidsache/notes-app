<?php
  require_once __DIR__ . "/../services/NoteService.php";

  class NoteController {
    private NoteService $noteService;

    public function __construct(NoteService $noteService) {
      $this->noteService = $noteService;
    }

    public function handleRequest(string $method, string $userId) {
      switch ($method) {
        case "GET":
          $this->handleGet($userId);
          break;
        case "POST":
          $this->handlePost($userId);
          break;
        case "PUT": 
          $this->handleUpdate($userId);
          break;
        case "DELETE": 
          $this->handleDelete($userId);
          break;
        default: 
          http_response_code(405);
          echo json_encode(["error" => "Method not allowed"]);
          break;
      }
    }

    private function handleGet(string $userId) {
      $notes = $this->noteService->getUserNotes($userId);

      if (!$notes) {
        http_response_code(400);
        echo json_encode(["error" => "Notes can't be fetched"]);
        return;
      }

      echo json_encode($notes);
      return;
    }

    private function handlePost(string $userId) {
      $input = json_decode(file_get_contents("php://input"), true);
      $note = $this->noteService->createNote($userId, $input);

      if (!$note) {
        http_response_code(400);
        echo json_encode(["error" => "Note could not be added"]);
        return;
      }

      echo json_encode(["success" => true, "note" => $note]);
      return;
    }

    private function handleUpdate(string $userId) {
      $id = $_GET['id'] ?? null;

      if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Note ID required"]);
        return;
      }

      $input = json_decode(file_get_contents("php://input"), true);
      $this->noteService->updateNote($id, $userId, $input);
      echo json_encode(["success" => true]);
    }

    private function handleDelete(string $userId) {
      $id = $_GET['id'] ?? null;
      
      if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Note ID required"]);
        return;
      }

      $this->noteService->deleteNote($id, $userId);
      echo json_encode(["success" => true]);
    }
  }
?>