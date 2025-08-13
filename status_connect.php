<?php
header('Content-Type: application/json');

$esp32_ip = "192.168.137.206";
$status_url = "http://$esp32_ip/api/status";

$response = @file_get_contents($status_url);

if ($response === false) {
    echo json_encode([
        "esp32" => false,
        "arduino" => false,
        "raspberry" => false,
        "message" => "เชื่อมต่อ ESP32 ไม่ได้"
    ]);
    exit;
}

$data = json_decode($response, true);

echo json_encode([
    "esp32"     => true,
    "arduino"   => $data["arduino"] ?? false,
    "raspberry" => $data["raspberry"] ?? false,
]);
