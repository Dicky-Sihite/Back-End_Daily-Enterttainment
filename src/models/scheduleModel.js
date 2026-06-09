const { pool } = require('../config/db');

const Schedule = {
  async create(data) {
    const {
      contentId,
      createdBy,
      title,
      description,
      poster,
      scheduleType = 'one_time',
      dayOfWeek,
      startTime,
      endTime,
      startDatetime,
      endDatetime,
      recurrenceRule,
      status = 'active',
    } = data;

    const query = `
      INSERT INTO schedules 
      (content_id, created_by, title, description, poster, schedule_type, 
       day_of_week, start_time, end_time, start_datetime, end_datetime, 
       recurrence_rule, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      contentId,
      createdBy,
      title,
      description,
      poster,
      scheduleType,
      dayOfWeek,
      startTime,
      endTime,
      startDatetime,
      endDatetime,
      recurrenceRule,
      status,
    ]);
    return result.rows[0];
  },

  async findById(id) {
    const query = `
      SELECT s.*, c.title as content_title, u.username as creator_name
      FROM schedules s
      JOIN contents c ON s.content_id = c.id
      LEFT JOIN users u ON s.created_by = u.id
      WHERE s.id = $1 AND c.deleted_at IS NULL;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findByContentId(contentId) {
    const query = `
      SELECT s.*, u.username as creator_name
      FROM schedules s
      LEFT JOIN users u ON s.created_by = u.id
      WHERE s.content_id = $1
      ORDER BY s.start_datetime DESC;
    `;

    const result = await pool.query(query, [contentId]);
    return result.rows;
  },

  async findByCreatedBy(userId) {
    const query = `
      SELECT s.*, c.title as content_title
      FROM schedules s
      JOIN contents c ON s.content_id = c.id
      WHERE s.created_by = $1 AND c.deleted_at IS NULL
      ORDER BY s.start_datetime DESC;
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async findActive() {
    const query = `
      SELECT s.*, c.title as content_title, u.username as creator_name
      FROM schedules s
      JOIN contents c ON s.content_id = c.id
      LEFT JOIN users u ON s.created_by = u.id
      WHERE s.status = 'active' AND c.deleted_at IS NULL
      ORDER BY s.start_datetime ASC;
    `;

    const result = await pool.query(query);
    return result.rows;
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.title) {
      fields.push(`title = $${paramCount++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.poster) {
      fields.push(`poster = $${paramCount++}`);
      values.push(data.poster);
    }
    if (data.dayOfWeek) {
      fields.push(`day_of_week = $${paramCount++}`);
      values.push(data.dayOfWeek);
    }
    if (data.startTime) {
      fields.push(`start_time = $${paramCount++}`);
      values.push(data.startTime);
    }
    if (data.endTime) {
      fields.push(`end_time = $${paramCount++}`);
      values.push(data.endTime);
    }
    if (data.startDatetime) {
      fields.push(`start_datetime = $${paramCount++}`);
      values.push(data.startDatetime);
    }
    if (data.endDatetime) {
      fields.push(`end_datetime = $${paramCount++}`);
      values.push(data.endDatetime);
    }
    if (data.recurrenceRule) {
      fields.push(`recurrence_rule = $${paramCount++}`);
      values.push(data.recurrenceRule);
    }
    if (data.status) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE schedules
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = `DELETE FROM schedules WHERE id = $1;`;
    await pool.query(query, [id]);
  },
};

module.exports = Schedule;
