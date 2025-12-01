import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertSensorReadingSchema } from "@shared/schema";
import { z } from "zod";

// Thresholds for alert detection
const THRESHOLDS = {
  maxSpeed: 120,
  accelThreshold: 4,
  brakingThreshold: 4,
  tiltThreshold: 45,
  turnThreshold: 35,
};

// WebSocket clients
const wsClients = new Set<WebSocket>();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    wsClients.add(ws);
    console.log("WebSocket client connected. Total clients:", wsClients.size);

    ws.on("close", () => {
      wsClients.delete(ws);
      console.log("WebSocket client disconnected. Total clients:", wsClients.size);
    });
  });

  // Broadcast function
  function broadcast(data: any) {
    const message = JSON.stringify(data);
    wsClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // POST /api/telemetry - Receive sensor data from hardware
  app.post("/api/telemetry", async (req, res) => {
    try {
      const data = insertSensorReadingSchema.parse(req.body);
      
      // Save sensor reading to database
      const reading = await storage.createSensorReading(data);

      // Check for alerts and create them
      const generatedAlerts = [];

      if (data.isCrash) {
        const alert = await storage.createAlert({
          type: 'Crash Detection',
          severity: 'Critical',
          value: 1,
          unit: 'Event',
          message: 'Impact detected!',
        });
        generatedAlerts.push(alert);
      }

      if (data.speed > THRESHOLDS.maxSpeed) {
        const alert = await storage.createAlert({
          type: 'Over Speed',
          severity: 'High',
          value: data.speed,
          unit: 'km/h',
          message: `Speed exceeded ${THRESHOLDS.maxSpeed} km/h`,
        });
        generatedAlerts.push(alert);
      }

      if (data.acceleration > THRESHOLDS.accelThreshold) {
        const alert = await storage.createAlert({
          type: 'Sudden Acceleration',
          severity: 'High',
          value: data.acceleration,
          unit: 'm/s²',
          message: 'Rapid acceleration detected',
        });
        generatedAlerts.push(alert);
      }

      if (data.braking > THRESHOLDS.brakingThreshold) {
        const alert = await storage.createAlert({
          type: 'Sudden Braking',
          severity: 'High',
          value: data.braking,
          unit: 'm/s²',
          message: 'Hard braking detected',
        });
        generatedAlerts.push(alert);
      }

      if (Math.abs(data.tilt) > THRESHOLDS.tiltThreshold) {
        const alert = await storage.createAlert({
          type: 'Tilt Alert',
          severity: 'Critical',
          value: data.tilt,
          unit: 'deg',
          message: 'Dangerous tilt angle detected',
        });
        generatedAlerts.push(alert);
      }

      if (Math.abs(data.rotationRate) > THRESHOLDS.turnThreshold) {
        const alert = await storage.createAlert({
          type: 'Sharp Turn',
          severity: 'High',
          value: Math.abs(data.rotationRate),
          unit: 'deg/s',
          message: 'Aggressive turning detected',
        });
        generatedAlerts.push(alert);
      }

      // Broadcast to all connected WebSocket clients
      broadcast({
        type: 'sensor_update',
        data: reading,
        alerts: generatedAlerts,
      });

      res.json({ 
        success: true, 
        reading,
        alerts: generatedAlerts 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid sensor data format", details: error.errors });
      } else {
        console.error("Error saving telemetry:", error);
        res.status(500).json({ error: "Failed to save sensor data" });
      }
    }
  });

  // GET /api/sensor-readings - Get recent sensor readings
  app.get("/api/sensor-readings", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const readings = await storage.getRecentSensorReadings(limit);
      res.json(readings);
    } catch (error) {
      console.error("Error fetching sensor readings:", error);
      res.status(500).json({ error: "Failed to fetch sensor readings" });
    }
  });

  // GET /api/sensor-readings/latest - Get latest sensor reading
  app.get("/api/sensor-readings/latest", async (req, res) => {
    try {
      const reading = await storage.getLatestSensorReading();
      if (!reading) {
        return res.status(404).json({ error: "No sensor readings found" });
      }
      res.json(reading);
    } catch (error) {
      console.error("Error fetching latest sensor reading:", error);
      res.status(500).json({ error: "Failed to fetch latest sensor reading" });
    }
  });

  // GET /api/alerts - Get recent alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const alertsList = await storage.getRecentAlerts(limit);
      res.json(alertsList);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  return httpServer;
}
