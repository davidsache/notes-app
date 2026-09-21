<?php
  class UserService {
    private User $userModel;

    public function __construct(User $userModel) {
      $this->userModel = $userModel;
    }

    public function getUserSettings(string $userId) {
      return $this->userModel->getUserSettings($userId);
    }

    public function insertUserSettings(string $userId, string $color, string $font) {
      return $this->userModel->insertUserSettings($userId, $color, $font);
    }

    public function updateUserSettings(string $userId, string $color, string $font) {
      return $this->userModel->updateUserSettings($userId, $color, $font);
    }
  }
?>