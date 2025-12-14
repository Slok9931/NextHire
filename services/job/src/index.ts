import app from "./app.js"
import dotenv from "dotenv"
import { sql } from "./utils/db.js"

dotenv.config()

async function initDB() { 
    try {
        await sql`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_type') THEN
                CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'internship');
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_location') THEN
                CREATE TYPE work_location AS ENUM ('onsite', 'remote', 'hybrid');
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
                CREATE TYPE application_status AS ENUM ('applied', 'rejected', 'hired');
            END IF;
        END
        $$;
        `
    } catch (error) {
        
    }
}

app.listen(process.env.PORT, () => {
  console.log(`Job service is running on port ${process.env.PORT}`);
});