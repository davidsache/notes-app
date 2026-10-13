<?php
  require_once __DIR__ . "/../services/NoteService.php";
  require_once __DIR__ . "/BaseController.php";

  class NoteController extends BaseController {
    private NoteService $noteService;

    public function __construct(NoteService $noteService) {
      $this->noteService = $noteService;
    }

    public function handleRequest(string $method, int $userId) {
      switch ($method) {
        case "GET":
          $this->handleGet($userId);
          break;
        case "POST":
          $this->handlePost($userId);
          break;
        case "PUT": 
          $this->handlePut($userId);
          break;
        case "DELETE": 
          $this->handleDelete($userId);
          break;
        default: 
          $this->error('Method not allowed', 405);
      }
    }

    private function handleGet(int $userId) {
      try {
        // Get note
        if (isset($_GET["id"])) {
          $note = $this->noteService->getNoteById($_GET["id"], $userId);
          $this->json(["note" => $note]);
        }

        // Get all notes
        $notes = $this->noteService->getUserNotes($userId);
        $this->json(["notes" => $notes]);
      }
      catch (NotFoundException $e) {
        $this->error($e->getMessage(), 404);
      }
      catch (Exception $e) {
        $this->error('Failed to retrieve notes', 500);
      }
    }

    private function handlePost(int $userId) {
      $input = json_decode(file_get_contents("php://input"), true) ?? [];

      try {
        $noteId = $this->noteService->createNote($userId, $input);
        $this->json(['success' => $noteId ? true : false], $noteId ? 201 : 500);
      }
      catch (ValidationException $e) {
        $this->error($e->getMessage(), 422, $e->getErrors());
      }
      catch (Exception $e) {
        $this->error('Failed to create note', 500);
      }
    }

    private function handlePut(int $userId) {
      $id = (int) $_GET['id'] ?? null;

      if (!$id) {
        $this->error('Missing required note ID parameter', 400);
      }

      $input = json_decode(file_get_contents("php://input"), true) ?? [];

      try {
        $success = $this->noteService->updateNote($id, $userId, $input);
        $this->json(['success' => $success], $success ? 200 : 500);
      }
      catch (NotFoundException $e) {
        $this->error($e->getMessage(), 404);
      }
      catch (ValidationException $e) {
        $this->error($e->getMessage(), 422, $e->getErrors());
      }
      catch (Exception $e) {
        $this->error('Failed to update note', 500);
      }
    }

    private function handleDelete(int $userId) {
      $id = (int) $_GET['id'] ?? null;
      
      if (!$id) {
        throw new ValidationException("No note ID was provided");
      }

      try {
        $result = $this->noteService->deleteNote($id, $userId);
        $this->json(['success' => $result], $result ? 200 : 500);
      }
      catch (Exception $e) {
        $this->error($e->getMessage(), $e->getCode());
      }
    }
  }
?>