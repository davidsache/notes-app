<?php
  require_once __DIR__ . "/../services/TagService.php";
  require_once __DIR__ . "/BaseController.php";

  class TagController extends BaseController {
    private TagService $tagService;

    public function __construct(TagService $tagService) {
      $this->tagService = $tagService;
    }

    public function handleRequest(string $method, int $userId) {
      switch ($method) {
        case "GET":
          $this->handleGet($userId);
          break;
        case "POST":
          $this->handlePost($userId);
          break;
        case "DELETE":
          $this->handleDelete($userId);
          break;
        default:
          $this->error('Method not allowed', 405);
      }  
    }

    private function handleGet(int $userId) {
      $tagId = $_GET["id"] ?? null;

      // Get a single tag
      if ($tagId) {
        try {
          $tag = $this->tagService->getTag($tagId, $userId);
          $this->json([$tag]);
        }
        catch (ValidationException $e) {
          $this->error($e->getMessage(), 422, $e->getErrors());
        }
        catch (Exception $e) {
          $this->error($e->getMessage(), $e->getCode());
        }
      }
      // Get all the tags
      else {
        try {
          $tags = $this->tagService->getAllTags($userId);
          $this->json(["tags" => $tags]);
        }
        catch (ValidationException $e) {
          $this->error($e->getMessage(), 422, $e->getErrors());
        }
        catch (Exception $e) {
          $this->error($e->getMessage(), $e->getCode());
        }
      }

      $this->error('Invalid operation', 400);
    }

    private function handlePost(int $userId) {
      $input = json_decode(file_get_contents('php://input'), true) ?? [];
      $name = $input["name"] ?? null;

      if (!$name) {
        $this->error("Missing tag name parameter");
      }

      try {
        $success = $this->tagService->addTag($userId, $name);
        $this->json(['success' => $success ? true : false], $success ? 201 : 500);
      }
      catch (ValidationException $e) {
        $this->error($e->getMessage(), 422, $e->getErrors());
      }
      catch (Exception $e) {
        $this->error($e->getMessage(), $e->getCode());
      }
    }

    private function handleDelete(int $userId) {
      $tagId = $_GET["tag_id"] ?? null;

      if (!$tagId) {
        $this->error('Missing tag ID parameter');
      }

      try {
        $success = $this->tagService->deleteTag($tagId, $userId);
        $this->json(['success' => $success]);
      }
      catch (ValidationException $e) {
        $this->error($e->getMessage(), 422, $e->getErrors());
      }
      catch (Exception $e) {
        $this->error($e->getMessage(), $e->getCode());
      }
    }
  }
?>