const { pool } = require('../config/db');

const MusicDetails = {
  async create(contentId, data) {
    const {
      artist,
      album,
      durationSeconds,
      audioUrl,
      lyrics,
    } = data;

    const query = `
      INSERT INTO music_details 
      (content_id, artist, album, duration_seconds, audio_url, lyrics)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      contentId,
      artist,
      album,
      durationSeconds,
      audioUrl,
      lyrics,
    ]);
    return result.rows[0];
  },

  async findByContentId(contentId) {
    const query = `SELECT * FROM music_details WHERE content_id = $1;`;
    const result = await pool.query(query, [contentId]);
    return result.rows[0];
  },

  async update(contentId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.artist) {
      fields.push(`artist = $${paramCount++}`);
      values.push(data.artist);
    }
    if (data.album) {
      fields.push(`album = $${paramCount++}`);
      values.push(data.album);
    }
    if (data.durationSeconds) {
      fields.push(`duration_seconds = $${paramCount++}`);
      values.push(data.durationSeconds);
    }
    if (data.audioUrl) {
      fields.push(`audio_url = $${paramCount++}`);
      values.push(data.audioUrl);
    }
    if (data.lyrics !== undefined) {
      fields.push(`lyrics = $${paramCount++}`);
      values.push(data.lyrics);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(contentId);

    const query = `
      UPDATE music_details
      SET ${fields.join(', ')}
      WHERE content_id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(contentId) {
    const query = `DELETE FROM music_details WHERE content_id = $1;`;
    await pool.query(query, [contentId]);
  },
};

module.exports = MusicDetails;
