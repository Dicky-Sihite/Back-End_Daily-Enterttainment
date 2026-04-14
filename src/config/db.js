const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'daily_entertainment',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function connectDB() {
  try {
    await pool.connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error', error);
    process.exit(1);
  }
}

module.exports = { pool, connectDB };
