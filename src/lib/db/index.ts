import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = connectionString ? postgres(connectionString, { prepare: false }) : null;

export const db = client ? drizzle(client, { schema }) : (null as unknown as ReturnType<typeof drizzle<typeof schema>>);
export * from "./schema";
