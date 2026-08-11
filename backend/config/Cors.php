<?php
  // CORS and Session Configuration
  $allowed_origin = "http://localhost:5173";  // Frontend Origin

  header("Access-Control-Allow-Origin: $allowed_origin");
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Content-Type: application/json");

  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
  }

  session_set_cookie_params([
    "lifetime" => 86400,
    "path" => "/",
    "domain" => "localhost",  // Set to true in production with HTTPS
    "secure" => false,
    "httponly" => true,
    "samesite" => "Lax"
  ]);

  if (session_status() === PHP_SESSION_NONE) {
    session_start();
  }

  spl_autoload_register(function ($class) {
    $directories = ['Models', 'Services', 'Controllers'];
    
    foreach ($directories as $dir) {
      $file = __DIR__ . '/../src/' . $dir . '/' . $class . '.php';
      if (file_exists($file)) {
        require_once $file;
        return;
      }
    }
  });
?>