<?php
/**
 * TriHexa contact form mailer.
 * Receives JSON POST, validates, sends email via PHP mail().
 *
 * Deploy this file on any PHP-capable host.
 * Set MAIL_TO below to the recipient address.
 */

header('Content-Type: application/json; charset=utf-8');

// config
define('MAIL_TO', 'ginzzu_doc@mail.ru');
define('MAIL_SUBJECT', 'Новая заявка с сайта TriHexa');
define('ALLOWED_ORIGINS', [
    'https://trihexa.ru',
    'https://www.trihexa.ru',
    'http://localhost:4321',
    'http://localhost:3000',
]);

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ALLOWED_ORIGINS, true)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// parse input
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$interest = trim($data['interest'] ?? '');
$message = trim($data['message'] ?? '');

// validate
$errors = [];

if ($name === '') {
    $errors[] = 'Имя обязательно';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Некорректный email';
}
if ($message === '') {
    $errors[] = 'Сообщение обязательно';
}

// basic anti-spam: reject if any field contains obvious injection
foreach ([$name, $email, $interest, $message] as $field) {
    if (preg_match('/(\r|\n|%0a|%0d)/i', $field)) {
        $errors[] = 'Недопустимые символы';
        break;
    }
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'errors' => $errors]);
    exit;
}

// build email
$body  = "Имя: $name\n";
$body .= "Email: $email\n";
if ($interest !== '') {
    $body .= "Интерес: $interest\n";
}
$body .= "\nСообщение:\n$message\n";

$headers  = "From: noreply@trihexa.ru\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// send
$sent = mail(MAIL_TO, MAIL_SUBJECT, $body, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Ошибка отправки. Попробуйте позже.']);
}
