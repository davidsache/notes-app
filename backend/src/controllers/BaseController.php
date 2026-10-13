<?php
  abstract class BaseController {
    protected function json(array $data, int $statusCode = 200): void {
      http_response_code($statusCode);
      header('Content-Type: application/json');
      echo json_encode($data);
      exit();
    }

    protected function error(string $message, int $statusCode = 400, array $details = []): void {
      $this->json([
        'success' => false,
        'error' => $message,
        'details' => $details
      ], $statusCode);
    }
  }
?>