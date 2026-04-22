const { pool } = require('../config/db');

const Profile = {
  async upsert(userId, data) {
    const query = `
      INSERT INTO profiles 
      (user_id, full_name, bio, date_of_birth, gender, phone_number, address)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (user_id)
      DO UPDATE SET
        full_name = EXCLUDED.full_name,
        bio = EXCLUDED.bio,
        date_of_birth = EXCLUDED.date_of_birth,
        gender = EXCLUDED.gender,
        phone_number = EXCLUDED.phone_number,
        address = EXCLUDED.address,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      userId,
      data.full_name,
      data.bio,
      data.date_of_birth,
      data.gender,
      data.phone_number,
      data.address,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM profiles WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  },

  async delete(userId) {
    await pool.query(`DELETE FROM profiles WHERE user_id = $1`, [userId]);
  },
};

module.exports = Profile;