import app from './app.js'
// Why app.js not app.ts? Because of ES Module support in Node.js
import dotenv from 'dotenv'
import { sql } from './utils/db.js'

dotenv.config()

async function initDB() { 
  try {
    // Create user_role enum type if it doesn't exist
    await sql`
    DO 
    $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('jobseeker', 'recruiter');
      END IF;
    END
    $$;
    `;
    // Create users table if it doesn't exist
    await sql`
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone_number VARCHAR(20) NOT NULL,
      role user_role NOT NULL,
      bio TEXT,
      resume VARCHAR(255),
      resume_public_id VARCHAR(255),
      profile_pic VARCHAR(255),
      profile_pic_public_id VARCHAR(255),
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      subscription TIMESTAMPTZ
    );
    `;
    // Create skills table and user_skills junction table if they don't exist
    await sql`
    CREATE TABLE IF NOT EXISTS skills (
      skill_id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
    );
    `;
    await sql`
    CREATE TABLE IF NOT EXISTS user_skills (
      user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      skill_id INT NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, skill_id)
    );
    `;
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1); // Exit the process with an error code
  }
}

initDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Auth service is running on port ${process.env.PORT}`);
  });
})