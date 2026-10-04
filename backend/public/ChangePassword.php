<?php
  require_once __DIR__ . "/../config/Cors.php";
  require_once __DIR__ . "/../config/Database.php";
  require __DIR__ . '/../vendor/autoload.php';

  $userModel = new User($pdo);
  $authService = new AuthService($userModel);
  $authController = new AuthController($authService);

  $authController->changePassword();
?>