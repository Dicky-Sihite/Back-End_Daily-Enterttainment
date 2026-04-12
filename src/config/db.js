const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'daily_entertainment',
  password: 'pw',
  port: 5432,
});

async function connectDB() {
  try {
    await pool.connect();
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error', err);
    process.exit(1);
  }
}

module.exports = { pool, connectDB };
