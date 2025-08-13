<?php
// ✅ อ่านค่าล่าสุดจากไฟล์ JSON
$filepath = "latest.json";

if (!file_exists($filepath)) {
  echo json_encode(["temperature" => 0, "humidity" => 0, "lightLevel" => 0]);
  exit;
}

$json = file_get_contents($filepath);
$data = json_decode($json, true);

echo json_encode($data);
?>
