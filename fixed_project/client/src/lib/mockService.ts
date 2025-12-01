import { useState, useEffect } from 'react';

export interface SensorData {
  speed: number;        // km/h
  acceleration: number; // m/s²
  braking: number;      // m/s²
  tilt: number;         // degrees
  rotationRate: number; // degrees/s (yaw rate for turns)
  timestamp: number;
  isCrash: boolean;
}

export interface Alert {
  id: string;
  type: 'Over Speed' | 'Sudden Acceleration' | 'Sudden Braking' | 'Tilt Alert' | 'Sharp Turn' | 'Crash Detection';
  severity: 'High' | 'Critical';
  value: number;
  unit: string;
  timestamp: number;
  message: string;
}

// Configuration for thresholds (mock settings)
export const DEFAULT_THRESHOLDS = {
  maxSpeed: 120,
  accelThreshold: 4,
  brakingThreshold: 4,
  tiltThreshold: 45,
  turnThreshold: 35, // degrees per second
};

// Mock data generator
const generateData = (prev: SensorData): SensorData => {
  // Simulate random fluctuations
  const speedChange = (Math.random() - 0.45) * 5; 
  let newSpeed = Math.max(0, Math.min(180, prev.speed + speedChange));
  
  // Calculate acceleration
  let newAccel = speedChange > 0 ? speedChange : 0;
  let newBraking = speedChange < 0 ? Math.abs(speedChange) : 0;
  
  // Occasional events
  if (Math.random() < 0.05) newAccel += 5; // Sudden acceleration
  if (Math.random() < 0.05) newBraking += 5; // Sudden braking
  
  // Tilt
  let newTilt = (Math.random() - 0.5) * 5;
  if (Math.random() < 0.02) newTilt += 50; // Tilt event

  // Rotation (Turning)
  let newRotation = (Math.random() - 0.5) * 10; // Normal steering adjustments
  if (Math.random() < 0.04) newRotation += (Math.random() > 0.5 ? 40 : -40); // Sharp turn event

  // Crash event (very rare)
  const isCrash = Math.random() < 0.001;

  return {
    speed: newSpeed,
    acceleration: newAccel,
    braking: newBraking,
    tilt: newTilt,
    rotationRate: newRotation,
    timestamp: Date.now(),
    isCrash
  };
};

export function useVehicleData() {
  const [data, setData] = useState<SensorData>({
    speed: 60,
    acceleration: 0,
    braking: 0,
    tilt: 0,
    rotationRate: 0,
    timestamp: Date.now(),
    isCrash: false
  });

  const [history, setHistory] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const next = generateData(prev);
        
        // Update history (keep last 50 points)
        setHistory(h => [...h.slice(-49), next]);

        // Check for alerts
        const newAlerts: Alert[] = [];
        
        if (next.isCrash) {
          newAlerts.push({
            id: crypto.randomUUID(),
            type: 'Crash Detection',
            severity: 'Critical',
            value: 1,
            unit: 'Event',
            timestamp: next.timestamp,
            message: 'Impact detected!'
          });
        }

        if (next.speed > DEFAULT_THRESHOLDS.maxSpeed) {
          newAlerts.push({
            id: crypto.randomUUID(),
            type: 'Over Speed',
            severity: 'High',
            value: Math.round(next.speed),
            unit: 'km/h',
            timestamp: next.timestamp,
            message: `Speed exceeded ${DEFAULT_THRESHOLDS.maxSpeed} km/h`
          });
        }

        if (next.acceleration > DEFAULT_THRESHOLDS.accelThreshold) {
          newAlerts.push({
            id: crypto.randomUUID(),
            type: 'Sudden Acceleration',
            severity: 'High',
            value: Number(next.acceleration.toFixed(1)),
            unit: 'm/s²',
            timestamp: next.timestamp,
            message: 'Rapid acceleration detected'
          });
        }

        if (next.braking > DEFAULT_THRESHOLDS.brakingThreshold) {
          newAlerts.push({
            id: crypto.randomUUID(),
            type: 'Sudden Braking',
            severity: 'High',
            value: Number(next.braking.toFixed(1)),
            unit: 'm/s²',
            timestamp: next.timestamp,
            message: 'Hard braking detected'
          });
        }

        if (Math.abs(next.tilt) > DEFAULT_THRESHOLDS.tiltThreshold) {
          newAlerts.push({
            id: crypto.randomUUID(),
            type: 'Tilt Alert',
            severity: 'Critical',
            value: Number(next.tilt.toFixed(1)),
            unit: 'deg',
            timestamp: next.timestamp,
            message: 'Dangerous tilt angle detected'
          });
        }

        if (Math.abs(next.rotationRate) > DEFAULT_THRESHOLDS.turnThreshold) {
           newAlerts.push({
            id: crypto.randomUUID(),
            type: 'Sharp Turn',
            severity: 'High',
            value: Number(Math.abs(next.rotationRate).toFixed(1)),
            unit: 'deg/s',
            timestamp: next.timestamp,
            message: 'Aggressive turning detected'
          });       
        }

        if (newAlerts.length > 0) {
          setAlerts(prevAlerts => [...newAlerts, ...prevAlerts].slice(0, 50));
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { data, history, alerts };
}
