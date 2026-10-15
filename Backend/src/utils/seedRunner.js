import { connectDB, disconnectDB } from '../config/database.js';
import { seedMenu, seedAdminUser } from './seedMenu.js';

async function run() {
  try {
    await connectDB();
    await seedMenu();
    await seedAdminUser();
    console.log('[Seed Runner] Seeding finished successfully.');
  } catch (err) {
    console.error('[Seed Runner Error]', err);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

run();
