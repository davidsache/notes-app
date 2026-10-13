<?php
  class ValidationException extends Exception {
    private array $errors;

    public function __construct(string $message, array $errors = []) {
      parent::__construct($message, 422);
      $this->errors = $errors;
    }

    public function getErrors(): array {
      return $this->errors;
    }
  }

  class NotFoundException extends Exception {
    public function __construct(string $message = 'Resource not found') {
      parent::__construct($message, 404);
    }
  }

  class UnauthorizedException extends Exception {
    public function __construct(string $message = 'Unauthorized') {
      parent::__construct($message, 401);
    }
  }

  class ConflictException extends Exception {
    public function __construct(string $message = 'Resource conflict') {
        parent::__construct($message, 409);
    }
  }
?>