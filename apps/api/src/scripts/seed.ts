import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { connectRedis, disconnectRedis } from "../config/redis.js";
import { loadModules } from "../services/moduleLoader.js";

async function main(): Promise<void> {
  await connectDatabase();
  await connectRedis();
  await loadModules();
  await disconnectRedis();
  await disconnectDatabase();
}

main().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
