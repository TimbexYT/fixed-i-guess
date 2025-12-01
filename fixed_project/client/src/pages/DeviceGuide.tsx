import DashboardLayout from "@/components/layout/DashboardLayout";
import { Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function DeviceGuide() {
  const [copied, setCopied] = useState(false);

  const apiEndpoint = `${window.location.protocol}//${window.location.host}/api/telemetry`;
  
  const jsonExample = `{
  "speed": 85.5,
  "acceleration": 2.3,
  "braking": 1.2,
  "tilt": 5.0,
  "rotationRate": 12.5,
  "isCrash": false
}`;

  const arduinoExample = `#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "${apiEndpoint}";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected!");
}

void sendTelemetry(float speed, float accel, float braking, 
                   float tilt, float rotation, bool crash) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    StaticJsonDocument<256> doc;
    doc["speed"] = speed;
    doc["acceleration"] = accel;
    doc["braking"] = braking;
    doc["tilt"] = tilt;
    doc["rotationRate"] = rotation;
    doc["isCrash"] = crash;
    
    String jsonPayload;
    serializeJson(doc, jsonPayload);
    
    int httpCode = http.POST(jsonPayload);
    
    if (httpCode > 0) {
      Serial.printf("HTTP Response: %d\\n", httpCode);
    } else {
      Serial.printf("Error: %s\\n", http.errorToString(httpCode).c_str());
    }
    
    http.end();
  }
}

void loop() {
  // Read your sensors here
  float speed = readSpeedSensor();
  float accel = readAccelerometer();
  float braking = calculateBraking();
  float tilt = readTiltAngle();
  float rotation = readGyroscope();
  bool crash = detectCrash();
  
  sendTelemetry(speed, accel, braking, tilt, rotation, crash);
  delay(1000); // Send every second
}`;

  const pythonExample = `import requests
import time

API_URL = "${apiEndpoint}"

def send_telemetry(speed, acceleration, braking, tilt, rotation_rate, is_crash):
    payload = {
        "speed": speed,
        "acceleration": acceleration,
        "braking": braking,
        "tilt": tilt,
        "rotationRate": rotation_rate,
        "isCrash": is_crash
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        if response.status_code == 200:
            print("✓ Data sent successfully")
            print(response.json())
        else:
            print(f"✗ Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"✗ Connection error: {e}")

# Example usage
while True:
    # Read your sensors here (example values)
    speed = 75.5
    acceleration = 1.8
    braking = 0.5
    tilt = 3.2
    rotation_rate = 8.5
    is_crash = False
    
    send_telemetry(speed, acceleration, braking, tilt, rotation_rate, is_crash)
    time.sleep(1)  # Send every second`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Device Integration Guide</h2>
          <p className="text-muted-foreground">Connect your Arduino, ESP32, or Raspberry Pi</p>
        </div>

        {/* API Endpoint */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            API Endpoint
          </h3>
          <div className="bg-secondary/50 p-4 rounded-lg font-mono text-sm flex items-center justify-between">
            <code className="text-primary">{apiEndpoint}</code>
            <button
              onClick={() => copyToClipboard(apiEndpoint)}
              className="p-2 hover:bg-white/5 rounded-md transition-colors"
              data-testid="button-copy-endpoint"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Send POST requests to this endpoint with your sensor data
          </p>
        </div>

        {/* JSON Format */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning"></span>
            JSON Format
          </h3>
          <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
            <code>{jsonExample}</code>
          </pre>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Field Descriptions:</p>
            <ul className="space-y-1 text-muted-foreground ml-4">
              <li>• <code className="text-primary">speed</code>: Vehicle speed in km/h</li>
              <li>• <code className="text-primary">acceleration</code>: Acceleration in m/s²</li>
              <li>• <code className="text-primary">braking</code>: Braking force in m/s²</li>
              <li>• <code className="text-primary">tilt</code>: Tilt angle in degrees</li>
              <li>• <code className="text-primary">rotationRate</code>: Rotation/turning rate in deg/s</li>
              <li>• <code className="text-primary">isCrash</code>: Boolean crash detection flag</li>
            </ul>
          </div>
        </div>

        {/* Arduino/ESP32 Example */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-chart-1"></span>
              Arduino/ESP32 Code
            </h3>
            <button
              onClick={() => copyToClipboard(arduinoExample)}
              className="text-sm flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
              data-testid="button-copy-arduino"
            >
              <Copy className="h-3 w-3" />
              Copy
            </button>
          </div>
          <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-96">
            <code>{arduinoExample}</code>
          </pre>
          <p className="text-xs text-muted-foreground">
            Install <code>ArduinoJson</code> library via Arduino Library Manager
          </p>
        </div>

        {/* Python Example */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-chart-2"></span>
              Python Code (Raspberry Pi)
            </h3>
            <button
              onClick={() => copyToClipboard(pythonExample)}
              className="text-sm flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
              data-testid="button-copy-python"
            >
              <Copy className="h-3 w-3" />
              Copy
            </button>
          </div>
          <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-96">
            <code>{pythonExample}</code>
          </pre>
          <p className="text-xs text-muted-foreground">
            Install: <code>pip install requests</code>
          </p>
        </div>

        {/* Testing */}
        <div className="glass-panel p-6 rounded-xl space-y-4 border-primary/20">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            Test Your Connection
          </h3>
          <p className="text-sm text-muted-foreground">
            Use <code className="text-primary">curl</code> or Postman to test the API:
          </p>
          <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
            <code>{`curl -X POST ${apiEndpoint} \\
  -H "Content-Type: application/json" \\
  -d '{"speed":75,"acceleration":2,"braking":1,"tilt":5,"rotationRate":10,"isCrash":false}'`}</code>
          </pre>
          <p className="text-sm text-green-500">
            ✓ If successful, you'll see the data appear in real-time on the Dashboard!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
