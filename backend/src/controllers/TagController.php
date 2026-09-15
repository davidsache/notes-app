<?php
  require_once __DIR__ . "/../services/TagService.php";

  class TagController {
    private TagService $tagService;

    public function __construct(TagService $tagService) {
      $this->tagService = $tagService;
    }

    public function handleRequest(string $method, string $userId) {
      switch ($method) {
        case "GET":
          $this->handleGet($userId);
          break;
        case "POST":
          $this->handlePost($userId);
          break;
        case "UPDATE":
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
      // Get tags of note
      if (isset($_GET["note_id"])) {
        $tags = $this->tagService->getNoteTags($_GET["note_id"], $userId);

        if (!$tags) {
          http_response_code(404);
          echo json_encode(["error" => "Tags not found"]);
          return;
        }

        http_response_code(201);
        echo json_encode($tags);
        return;
      }
      // Get a single tag
      if (isset($_GET["id"])) {
        $tag = $this->tagService->getTag($_GET["id"], $userId);

        if (!$tag) {
          http_response_code(404);
          echo json_encode(["error" => "Tag not found"]);
          return;
        }

        http_response_code(201);
        echo json_encode($tag);
        return;
      }
      // Get all the tags
      else {
        $tags = $this->tagService->getAllTags();

        if (!$tags) {
          http_response_code(404);
          echo json_encode(["error" => "Tags not found"]);
          return;
        }

        http_response_code(201);
        echo json_encode($tags);
        return;
      }
    }

    private function handlePost(string $userId) {
      $input = json_decode(file_get_contents('php://input'), true);
      $noteId = $input["note_id"] ?? null;
      $tagId = $input["tag_id"] ?? null;

      // Add tag to note
      if ($noteId && $tagId) {
        $success = $this->tagService->addNoteTag($noteId, $tagId, $userId);
        echo json_encode(["success" => $success]);
        return;
      }

      $name = $input["name"] ?? null;

      // Add tag
      if ($userId && $name) {
        $success = $this->tagService->addTag($userId, $name);
        echo json_encode(["success" => $success]);
        return;
      }
    }

    private function handleDelete(string $userId) {
      $noteId = $_GET["note_id"] ?? null;
      $tagId = $_GET["tag_id"] ?? null;

      if (!$noteId || !$tagId) {
        http_response_code(400);
        echo json_encode(["error" => "note_id and tag_id required"]);
        return;
      }

      $success = $this->tagService->deleteNoteTag($noteId, $tagId, $userId);
      echo json_encode(["success" => $success]);
      return;
    }
  }
?>