import { useState, useEffect, useRef } from 'react';

export interface SensorData {
  id: number;
  speed: number;
  acceleration: number;
  braking: number;
  tilt: number;
  rotationRate: number;
  timestamp: string;
  isCrash: boolean;
}

export interface Alert {
  id: number;
  type: 'Over Speed' | 'Sudden Acceleration' | 'Sudden Braking' | 'Tilt Alert' | 'Sharp Turn' | 'Crash Detection';
  severity: 'High' | 'Critical';
  value: number;
  unit: string;
  timestamp: string;
  message: string;
}

export function useVehicleData() {
  const [data, setData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      try {
        const [readingsRes, alertsRes] = await Promise.all([
          fetch('/api/sensor-readings?limit=50'),
          fetch('/api/alerts?limit=50')
        ]);

        if (readingsRes.ok) {
          const readings = await readingsRes.json();
          setHistory(readings.reverse()); // Reverse to show oldest first
          if (readings.length > 0) {
            setData(readings[0]); // Latest reading
          }
        }

        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          setAlerts(alertsData);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();

    // WebSocket connection for real-time updates
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'sensor_update') {
          const newReading = message.data;
          const newAlerts = message.alerts || [];

          // Update current data
          setData(newReading);

          // Update history (keep last 50)
          setHistory(prev => [...prev.slice(-49), newReading]);

          // Add new alerts to the top
          if (newAlerts.length > 0) {
            setAlerts(prev => [...newAlerts, ...prev].slice(0, 50));
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  return { data, history, alerts };
}
