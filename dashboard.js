const esp_ip = "http://192.168.111.75";

// ===== แสดงสถานะการเชื่อมต่ออุปกรณ์ =====
function updateStatusDisplay(id, value) {
  const el = document.getElementById("status-" + id);
  if (!el) return;

  if (value === true || value === "connected") {
    el.textContent = "✅ เชื่อมต่อ";
    el.style.color = "green";
  } else {
    el.textContent = "❌ ตัดการเชื่อมต่อ";
    el.style.color = "red";
  }
}

// ===== เรียกข้อมูลสถานะการเชื่อมต่อจาก ESP32 =====
async function fetchConnectionStatus() {
  try {
    const res = await fetch(esp_ip + "/api/status");
    const status = await res.json();

    updateStatusDisplay("esp", true); // ถ้าโหลดได้ แสดงว่า ESP online อยู่แล้ว
    updateStatusDisplay("pi", status.raspberry);
    updateStatusDisplay("arduino", status.arduino);
    updateStatusDisplay("wifi", status.wifi);
    updateStatusDisplay("server", status.server);
  } catch (err) {
    console.error("เชื่อมต่อ ESP ไม่ได้:", err);
    ["esp", "pi", "arduino", "wifi", "server"].forEach(id => {
      updateStatusDisplay(id, false);
    });
  }
}

// ===== โหลดเมื่อเปิดเว็บ =====
window.onload = function () {
  fetchConnectionStatus();
  setInterval(fetchConnectionStatus, 300); // อัปเดตทุก 5 วินาที
};

// ===== ดึงข้อมูลล่าสุดจาก latest_sensor.php =====
function fetchLatestSensorData() {
  fetch("api/latest_sensor.php")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("temp").innerText = data.temperature + "°C";
      document.getElementById("hum").innerText = data.humidity + "%";
      document.getElementById("light").innerText = data.lightLevel + " lux";

      updateChart(tempChart, data.temperature);
      updateChart(humChart, data.humidity);
      updateChart(lightChart, data.lightLevel);
    })
    .catch((err) => {
      console.error("Error fetching sensor data:", err);
    });
}

// ===== ฟังก์ชันสร้างกราฟ Chart.js =====
function createLiveChart(ctx, label, color) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: label,
        data: [],
        borderColor: color,
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        x: { display: false },
        y: { beginAtZero: true }
      }
    }
  });
}

// ===== อัปเดตข้อมูลลงกราฟ =====
function updateChart(chart, value) {
  const now = new Date().toLocaleTimeString();
  const data = chart.data;

  if (data.labels.length >= 20) {
    data.labels.shift();
    data.datasets[0].data.shift();
  }

  data.labels.push(now);
  data.datasets[0].data.push(value);
  chart.update();
}

// ===== อัปเดตสถานะการเชื่อมต่อ ESP/Pi/Arduino =====
function updateStatusDisplay(id, value) {
  const el = document.getElementById("status-" + id);
  if (!el) return;

  if (value === true || value === "connected") {
    el.textContent = "✅ เชื่อมต่อ";
    el.style.color = "green";
  } else {
    el.textContent = "❌ ตัดการเชื่อมต่อ";
    el.style.color = "red";
  }
}

// ===== โหลดเมื่อเปิดเว็บ =====
let tempChart, humChart, lightChart;

window.onload = function () {
  const tempCtx = document.getElementById("tempChart").getContext("2d");
  const humCtx = document.getElementById("humChart").getContext("2d");
  const lightCtx = document.getElementById("lightChart").getContext("2d");

  tempChart = createLiveChart(tempCtx, "Temperature (°C)", "green");
  humChart = createLiveChart(humCtx, "Humidity (%)", "blue");
  lightChart = createLiveChart(lightCtx, "Light (lux)", "orange");

  fetchLatestSensorData();
  fetchConnectionStatus();

  // วนซ้ำดึงข้อมูลทุกช่วงเวลา
  setInterval(fetchLatestSensorData, 500);
  setInterval(fetchConnectionStatus, 5000);
};
