import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

export const hasDatabase = !!process.env.DATABASE_URL;

export let pool: Pool | null = null;
export let db: ReturnType<typeof drizzle> | null = null;

if (hasDatabase) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
} else {
  console.log("DATABASE_URL not set. Running with in-memory storage.");
}
