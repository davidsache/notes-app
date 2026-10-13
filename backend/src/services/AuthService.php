<?php
  class AuthService {
    private User $userModel;

    public function __construct(User $userModel) {
      $this->userModel = $userModel;
    }

    public function authenticate(string $email, string $password) {
      $email = trim($email);
      if (empty($email) || empty($password)) {
        throw new ValidationException('Validation failed', ['credentials' => 'Email and password are required.']);
      }

      $user = $this->userModel->getByEmail($email);
      if (!$user || !password_verify($password, $user['password_hash'])) {
        throw new UnauthorizedException('Invalid email or password');
      }

      return $user;
    }

    public function signUp(string $email, string $username, string $password) {
      $email = filter_var(trim($email), FILTER_VALIDATE_EMAIL);
      if (!$email) {
        throw new ValidationException('Validation failed', ['email' => 'Invalid email address format.']);
      }
      if (strlen($password) < 8) {
        throw new ValidationException('Validation failed', ['password' => 'Password must be at least 8 characters long.']);
      }
      if ($this->userModel->getByEmail($email)) {
        throw new ConflictException('A user with this email address already exists.');
      }

      $passwordHash = password_hash($password, PASSWORD_DEFAULT);
      $userId = $this->userModel->signUp($email, $username, $passwordHash);
      if (!$userId) {
        throw new Exception("Failed to create user account", 500);
      }

      return $userId;
    }

    public function resetPasswordRequest(string $email) {
      $email = filter_var(trim($email), FILTER_VALIDATE_EMAIL);
      if (!$email) {
        throw new ValidationException('Validation failed', ['email' => 'Invalid email address format.']);
      }

      $userExists = $this->userModel->getByEmail($email);
      if (!$userExists) {
        throw new NotFoundException("The user does not exist in the Database");
      }

      $userId = (int) $userExists["id"];
      $success = $this->userModel->resetPasswordRequest($userId, $email);
      if (!$success) {
        throw new Exception("The password request could not be created", 500);
      }

      return $success;
    }

    public function getPasswordResetRequest(string $token) {
      $request = $this->userModel->getPasswordResetRequest($token);

      if (!$request) {
        throw new NotFoundException("The password change request does not exist");
      }

      return $request;
    }

    public function changePassword(int $userId, string $password) {
      if (!$userId) {
        throw new ValidationException('Validation failed', ['user_id' => 'Invalid or not provided user ID.']);
      }
  
      if (strlen($password) < 8) {
        throw new ValidationException('Validation failed', ['password' => 'Password must be at least 8 characters long.']);
      }

      $passwordHash = password_hash($password, PASSWORD_DEFAULT);
      $success = $this->userModel->changePassword($userId, $passwordHash);
      if (!$success) {
        throw new Exception("The password could not be changed", 500);
      }

      return $success;
    }

    public function getUserById(int $id) {
      $user = $this->userModel->getById($id);

      if (!$user) {
        throw new NotFoundException("Does not exist an user with that ID");
      }

      return $user;
    }
  }
?>