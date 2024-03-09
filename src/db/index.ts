import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { config } from "../utils/config";

if (!config.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const connectionString = config.DATABASE_URL;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

export default db;