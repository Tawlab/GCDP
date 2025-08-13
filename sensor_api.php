<?php
header('Content-Type: application/json');

// ======= CONFIG =======
$esp32_ip = "192.168.137.206"; // ← เปลี่ยนให้ตรงกับ IP ของ ESP32
$esp32_url = "http://{$esp32_ip}/api/sensors";

// ======= FETCH FROM ESP32 =======
$response = @file_get_contents($esp32_url);

if ($response === false) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "ไม่สามารถเชื่อมต่อ ESP32 ได้"
    ]);
    exit;
}

// ======= PARSE AND FILTER =======
$data = json_decode($response, true);

if (!$data || !isset($data['valid']) || !$data['valid']) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "ข้อมูลไม่ถูกต้องหรือ ESP32 ไม่ตอบกลับ"
    ]);
    exit;
}

// ======= FILTERED OUTPUT =======
echo json_encode([
    "temperature"    => $data["temperature"],
    "humidity"       => $data["humidity"],
    "light_level"    => $data["light_level"],
    "soil_moisture"  => $data["soil_moisture"],
    
]);
