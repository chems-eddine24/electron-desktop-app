import { drizzle } from "drizzle-orm/node-postgres";
import 'dotenv/config'
import pg from "pg";
console.log(process.env.DATABASE_URL);
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
export type DrizzleDb = typeof db;