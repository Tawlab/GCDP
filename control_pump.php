<?php
header('Content-Type: application/json');

// ✅ ตรวจสอบว่าเป็น POST เท่านั้น
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'ต้องใช้ POST เท่านั้น']);
    exit;
}

// ✅ รับข้อมูล JSON ที่ส่งเข้ามา
$input = json_decode(file_get_contents('php://input'), true);
$command = $input['command'] ?? '';

if (!$command) {
    echo json_encode(['success' => false, 'message' => 'ไม่มีคำสั่ง']);
    exit;
}

// ✅ IP ของ ESP32 ที่ต้องการควบคุม
$esp_ip = '192.168.137.206';
$url = "http://$esp_ip/api/command";

// ✅ เตรียมข้อมูลส่งไป ESP32
$payload = json_encode(['command' => $command]);

$options = [
    'http' => [
        'method'  => 'POST',
        'header'  => "Content-Type: application/json\r\n",
        'content' => $payload
    ]
];
$context = stream_context_create($options);

// ✅ ส่งคำสั่งไปยัง ESP32
$result = @file_get_contents($url, false, $context);

if ($result === FALSE) {
    echo json_encode(['success' => false, 'message' => "❌ ติดต่อ ESP32 ไม่สำเร็จที่ $esp_ip"]);
    exit;
}

// ✅ ตอบกลับสำเร็จ
echo json_encode(['success' => true, 'message' => "✅ ส่งคำสั่งแล้ว: $command"]);
