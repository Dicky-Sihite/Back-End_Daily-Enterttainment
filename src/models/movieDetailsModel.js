const { pool } = require('../config/db');

const MovieDetails = {
  async create(contentId, data) {
    const {
      director,
      durationSeconds,
      videoUrl,
      releaseDate,
      ageRating,
    } = data;

    const query = `
      INSERT INTO movie_details 
      (content_id, director, duration_seconds, video_url, release_date, age_rating)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      contentId,
      director,
      durationSeconds,
      videoUrl,
      releaseDate,
      ageRating,
    ]);
    return result.rows[0];
  },

  async findByContentId(contentId) {
    const query = `SELECT * FROM movie_details WHERE content_id = $1;`;
    const result = await pool.query(query, [contentId]);
    return result.rows[0];
  },

  async update(contentId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.director) {
      fields.push(`director = $${paramCount++}`);
      values.push(data.director);
    }
    if (data.durationSeconds) {
      fields.push(`duration_seconds = $${paramCount++}`);
      values.push(data.durationSeconds);
    }
    if (data.videoUrl) {
      fields.push(`video_url = $${paramCount++}`);
      values.push(data.videoUrl);
    }
    if (data.releaseDate) {
      fields.push(`release_date = $${paramCount++}`);
      values.push(data.releaseDate);
    }
    if (data.ageRating) {
      fields.push(`age_rating = $${paramCount++}`);
      values.push(data.ageRating);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(contentId);

    const query = `
      UPDATE movie_details
      SET ${fields.join(', ')}
      WHERE content_id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(contentId) {
    const query = `DELETE FROM movie_details WHERE content_id = $1;`;
    await pool.query(query, [contentId]);
  },
};

module.exports = MovieDetails;
