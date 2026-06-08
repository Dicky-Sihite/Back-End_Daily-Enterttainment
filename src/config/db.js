const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();

    console.log('Database connected successfully');

    client.release();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

module.exports = {
  pool,
  connectDB,
};