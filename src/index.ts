import "dotenv/config";
import {drizzle} from 'drizzle-orm/neon-http';

const {env} = process;
const db = drizzle(env.DATABASE_URL);
