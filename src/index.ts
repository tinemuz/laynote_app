import "dotenv/config";
import {drizzle} from 'drizzle-orm/neon-http';

drizzle(process.env.DATABASE_URL);
