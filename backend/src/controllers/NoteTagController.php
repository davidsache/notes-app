<?php
require_once __DIR__ . '/BaseController.php';

class NoteTagController extends BaseController {
  private NoteTagService $noteTagService;

  public function __construct(NoteTagService $noteTagService) {
    $this->noteTagService = $noteTagService;
  }

  public function handleRequest(string $method, int $userId): void {
    switch ($method) {
      case 'GET':
        $this->handleGet($userId);
        break;
      case 'POST':
        $this->handlePost($userId);
        break;
      case 'DELETE':
        $this->handleDelete($userId);
        break;
      default:
        $this->error('Method not allowed', 405);
    }
  }

  private function handleGet(int $userId) {
    $noteId = $_GET["note_id"] ?? null;
    
    if (!$noteId) {
      $this->error('Missing parameter: note ID');
    }

    try {
      $noteTags = $this->noteTagService->getNoteTags($noteId, $userId);
      $this->json(["noteTags" => $noteTags]);
    }
    catch (NotFoundException $e) {
      $this->error($e->getMessage(), 404);
    }
    catch (Exception $e) {
      $this->error('Failed to get tags of note', 500);
    }
  }

  private function handlePost(int $userId) {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $noteId = $input["note_id"] ?? null;
    $tagId = $input["tag_id"] ?? null;

    try {
      $success = $this->noteTagService->addNoteTag($noteId, $tagId, $userId);
      $this->json(['success' => $success], $success ? 201 : 500);
    }
    catch (NotFoundException $e) {
      $this->error($e->getMessage(), 404);
    }
    catch (Exception $e) {
      $this->error($e->getMessage(), $e->getCode());
    }
  }

  private function handleDelete(int $userId) {
    $noteId = $_GET["note_id"] ?? null;
    $tagId = $_GET["tag_id"] ?? null;

    if (!$noteId || !$tagId) {
      $this->error("note_id and tag_id query parameters are required", 400);
    }

    try {
      $success = $this->noteTagService->deleteNoteTag($noteId, $tagId, $userId);
      $this->json(['success' => $success], $success ? 200 : 500);
    }
    catch (NotFoundException $e) {
      $this->error($e->getMessage(), 404);
    }
    catch (Exception $e) {
      $this->error("Failed to disassociate tag", 500);
    }
  }
}