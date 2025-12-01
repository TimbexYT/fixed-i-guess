import { 
  type User, 
  type InsertUser,
  type SensorReading,
  type InsertSensorReading,
  type Alert,
  type InsertAlert,
  users,
  sensorReadings,
  alerts
} from "@shared/schema";
import { db, hasDatabase } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSensorReading(reading: InsertSensorReading): Promise<SensorReading>;
  getRecentSensorReadings(limit: number): Promise<SensorReading[]>;
  getLatestSensorReading(): Promise<SensorReading | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  getRecentAlerts(limit: number): Promise<Alert[]>;
}

export class InMemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private sensorReadings: SensorReading[] = [];
  private alerts: Alert[] = [];
  private readingId = 1;
  private alertId = 1;

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      ...insertUser,
    };
    this.users.set(user.id, user);
    return user;
  }

  async createSensorReading(reading: InsertSensorReading): Promise<SensorReading> {
    const sensorReading: SensorReading = {
      id: this.readingId++,
      speed: reading.speed,
      acceleration: reading.acceleration,
      braking: reading.braking,
      tilt: reading.tilt,
      rotationRate: reading.rotationRate,
      isCrash: reading.isCrash ?? false,
      timestamp: new Date(),
    };
    this.sensorReadings.unshift(sensorReading);
    if (this.sensorReadings.length > 1000) {
      this.sensorReadings = this.sensorReadings.slice(0, 1000);
    }
    return sensorReading;
  }

  async getRecentSensorReadings(limit: number = 50): Promise<SensorReading[]> {
    return this.sensorReadings.slice(0, limit);
  }

  async getLatestSensorReading(): Promise<SensorReading | undefined> {
    return this.sensorReadings[0];
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const newAlert: Alert = {
      id: this.alertId++,
      ...alert,
      timestamp: new Date(),
    };
    this.alerts.unshift(newAlert);
    if (this.alerts.length > 500) {
      this.alerts = this.alerts.slice(0, 500);
    }
    return newAlert;
  }

  async getRecentAlerts(limit: number = 50): Promise<Alert[]> {
    return this.alerts.slice(0, limit);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db!
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createSensorReading(reading: InsertSensorReading): Promise<SensorReading> {
    const [sensorReading] = await db!
      .insert(sensorReadings)
      .values(reading)
      .returning();
    return sensorReading;
  }

  async getRecentSensorReadings(limit: number = 50): Promise<SensorReading[]> {
    return await db!
      .select()
      .from(sensorReadings)
      .orderBy(desc(sensorReadings.timestamp))
      .limit(limit);
  }

  async getLatestSensorReading(): Promise<SensorReading | undefined> {
    const [reading] = await db!
      .select()
      .from(sensorReadings)
      .orderBy(desc(sensorReadings.timestamp))
      .limit(1);
    return reading || undefined;
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db!
      .insert(alerts)
      .values(alert)
      .returning();
    return newAlert;
  }

  async getRecentAlerts(limit: number = 50): Promise<Alert[]> {
    return await db!
      .select()
      .from(alerts)
      .orderBy(desc(alerts.timestamp))
      .limit(limit);
  }
}

export const storage: IStorage = hasDatabase ? new DatabaseStorage() : new InMemoryStorage();
