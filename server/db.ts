import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import * as blockchainSchema from "@shared/blockchain-schema";

// Configure WebSocket for Neon serverless (required for Replit)
neonConfig.webSocketConstructor = ws;

// Debug environment variables
console.log("🔍 Environment check:");
console.log("  NODE_ENV:", process.env.NODE_ENV);
console.log("  DATABASE_URL exists:", !!process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is missing!");
  console.error("🔧 To fix this on Replit:");
  console.error("   1. Go to Secrets tab (🔒 icon in sidebar)");
  console.error("   2. Add DATABASE_URL with your PostgreSQL connection string");
  console.error("   3. Restart your Repl");
  throw new Error(
    "DATABASE_URL must be set. Please add it to Replit Secrets.",
  );
}

// Enhanced pool configuration for Replit environment
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle({ client: pool, schema: { ...schema, ...blockchainSchema } });

// Test database connection on startup
pool.connect()
  .then(client => {
    console.log("✅ Database connected successfully");
    client.release();
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err.message);
    console.error("🔧 Check your DATABASE_URL in Replit Secrets");
  });