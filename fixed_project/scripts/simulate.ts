/**
 * Vehicle Sensor Data Simulator
 * Sends realistic telemetry data to the dashboard API
 * Run with: npx tsx scripts/simulate.ts
 */

const API_URL = process.env.API_URL || 'http://localhost:5000/api/telemetry';

interface SensorData {
  speed: number;
  acceleration: number;
  braking: number;
  tilt: number;
  rotationRate: number;
  isCrash: boolean;
}

// Current state
let state: SensorData = {
  speed: 60,
  acceleration: 0,
  braking: 0,
  tilt: 0,
  rotationRate: 0,
  isCrash: false,
};

// Alert thresholds (matching server)
const THRESHOLDS = {
  maxSpeed: 120,
  accelThreshold: 4,
  brakingThreshold: 4,
  tiltThreshold: 45,
  turnThreshold: 35,
};

// Generate next sensor reading with occasional events
function generateNextReading(): SensorData {
  const rand = Math.random();
  
  // Speed changes naturally
  const speedChange = (Math.random() - 0.45) * 8;
  let newSpeed = Math.max(0, Math.min(180, state.speed + speedChange));
  
  // Calculate acceleration/braking based on speed change
  let newAccel = speedChange > 0 ? Math.abs(speedChange) * 0.5 : 0;
  let newBraking = speedChange < 0 ? Math.abs(speedChange) * 0.5 : 0;
  
  // Normal tilt and rotation
  let newTilt = (Math.random() - 0.5) * 8;
  let newRotation = (Math.random() - 0.5) * 15;
  
  let isCrash = false;

  // === SIMULATE EVENTS (10% chance each second) ===
  
  // Over Speed event (8% chance)
  if (rand < 0.08) {
    newSpeed = 125 + Math.random() * 30; // 125-155 km/h
    console.log('🚨 Simulating OVER SPEED event:', Math.round(newSpeed), 'km/h');
  }
  
  // Sudden Acceleration event (6% chance)
  else if (rand < 0.14) {
    newAccel = 5 + Math.random() * 4; // 5-9 m/s²
    console.log('⚡ Simulating SUDDEN ACCELERATION event:', newAccel.toFixed(1), 'm/s²');
  }
  
  // Sudden Braking event (6% chance)
  else if (rand < 0.20) {
    newBraking = 5 + Math.random() * 4; // 5-9 m/s²
    console.log('🛑 Simulating SUDDEN BRAKING event:', newBraking.toFixed(1), 'm/s²');
  }
  
  // Tilt Alert event (4% chance)
  else if (rand < 0.24) {
    newTilt = (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 20); // 50-70 degrees
    console.log('📐 Simulating TILT ALERT event:', newTilt.toFixed(1), '°');
  }
  
  // Sharp Turn event (6% chance)
  else if (rand < 0.30) {
    newRotation = (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 30); // 40-70 deg/s
    console.log('↩️  Simulating SHARP TURN event:', Math.abs(newRotation).toFixed(1), '°/s');
  }
  
  // Crash Detection event (0.5% chance - rare)
  else if (rand < 0.305) {
    isCrash = true;
    newAccel = 15 + Math.random() * 10; // High impact
    console.log('💥 Simulating CRASH DETECTION event!');
  }

  state = {
    speed: newSpeed,
    acceleration: newAccel,
    braking: newBraking,
    tilt: newTilt,
    rotationRate: newRotation,
    isCrash,
  };

  return state;
}

// Send data to API
async function sendTelemetry(data: SensorData): Promise<void> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('API Error:', response.status, error);
      return;
    }

    const result = await response.json();
    
    // Log any alerts that were generated
    if (result.alerts && result.alerts.length > 0) {
      result.alerts.forEach((alert: any) => {
        const icon = alert.severity === 'Critical' ? '🔴' : '🟠';
        console.log(`  ${icon} Alert: ${alert.type} - ${alert.message}`);
      });
    }
  } catch (error) {
    console.error('Failed to send telemetry:', error);
  }
}

// Main simulation loop
async function runSimulation() {
  console.log('');
  console.log('🚗 Vehicle Sensor Simulator Started');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 Sending to: ${API_URL}`);
  console.log('');
  console.log('Simulating these alerts:');
  console.log('  • Over Speed (>120 km/h)');
  console.log('  • Sudden Acceleration (>4 m/s²)');
  console.log('  • Sudden Braking (>4 m/s²)');
  console.log('  • Tilt Alert (>45°)');
  console.log('  • Sharp Turn (>35 °/s)');
  console.log('  • Crash Detection');
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  let count = 0;
  
  // Send data every second
  setInterval(async () => {
    count++;
    const data = generateNextReading();
    
    // Log normal readings every 5 seconds
    if (count % 5 === 0) {
      console.log(
        `[${new Date().toLocaleTimeString()}] Speed: ${Math.round(data.speed)} km/h | ` +
        `Accel: ${data.acceleration.toFixed(1)} | Brake: ${data.braking.toFixed(1)} | ` +
        `Tilt: ${data.tilt.toFixed(1)}° | Rotation: ${data.rotationRate.toFixed(1)}°/s`
      );
    }
    
    await sendTelemetry(data);
  }, 1000);
}

// Start simulation
runSimulation();
