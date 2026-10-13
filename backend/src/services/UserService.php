<?php
  class UserService {
    private User $userModel;

    public function __construct(User $userModel) {
      $this->userModel = $userModel;
    }

    public function getUserSettings(int $userId) {
      $userSettings = $this->userModel->getUserSettings($userId);

      if (!$userSettings) {
        throw new NotFoundException("The user settings does not exist");
      }

      return $userSettings;
    }

    public function insertUserSettings(int $userId, string $color, string $font) {
      $success = $this->userModel->insertUserSettings($userId, $color, $font);

      if (!$success) {
        throw new Exception("The user settings could not be added to the Database", 500);
      }

      return $success;
    }

    public function updateUserSettings(int $userId, string $color, string $font) {
      $success = $this->userModel->updateUserSettings($userId, $color, $font);

      if (!$success) {
        throw new Exception("The user settings could not be updated", 500);
      }

      return true;
    }
  }
?>