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
          $notes = $this->noteService->getUserNotes($userId);
          echo json_encode($notes);
          break;
        
        case "POST":
          $input = json_decode(file_get_contents("php://input"), true);
          $id = $this->noteService->createNote($userId, $input);
          echo json_encode(["success" => true, "id" => $id]);
          break;
        
        case "PUT": 
          $id = $_GET['id'] ?? null;
          if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "Note ID required"]);
            return;
          }

          $input = json_decode(file_get_contents("php://input"), true);
          $this->noteService->updateNote($id, $userId, $input);
          echo json_encode(["success" => true]);
          break;
        
        case "DELETE": 
          $id = $_GET['id'] ?? null;
          if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "Note ID required"]);
            return;
          }

          $this->noteService->deleteNote($id, $userId);
          echo json_encode(["success" => true]);
          break;
        
        default: 
          http_response_code(405);
          echo json_encode(["error" => "Method not allowed"]);
          break;
      }
    }
  }
?>