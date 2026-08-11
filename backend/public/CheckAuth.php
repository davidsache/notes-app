<?php
  require_once __DIR__ . "/../config/Cors.php";
  require_once __DIR__ . "/../config/Database.php";

  $userModel = new User($pdo);
  $authService = new AuthService($userModel);
  $controller = new AuthController($authService);

  $controller->check();
?>