const { pool } = require('../config/db');

const Content = {
  async create(data) {
    const {
      userId,
      contentTypeId,
      title,
      slug,
      description,
      thumbnail,
      status = 'draft',
    } = data;

    const query = `
      INSERT INTO contents 
      (user_id, content_type_id, title, slug, description, thumbnail, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      userId,
      contentTypeId,
      title,
      slug,
      description,
      thumbnail,
      status,
    ]);
    return result.rows[0];
  },

  async findById(id) {
    const query = `
      SELECT c.*, 
             ct.name as content_type_name, 
             u.username as author_name,
             array_agg(DISTINCT cat.id) as category_ids,
             array_agg(DISTINCT cat.name) as category_names,
             md.director as director,
             md.video_url as video_url,
             msd.artist as artist,
             msd.audio_url as audio_url,
             nd.author as author,
             nd.body as body,
             COALESCE(md.video_url, msd.audio_url) as url
      FROM contents c
      LEFT JOIN content_types ct ON c.content_type_id = ct.id
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN content_categories cc ON c.id = cc.content_id
      LEFT JOIN categories cat ON cc.category_id = cat.id
      LEFT JOIN movie_details md ON c.id = md.content_id
      LEFT JOIN music_details msd ON c.id = msd.content_id
      LEFT JOIN news_details nd ON c.id = nd.content_id
      WHERE c.id = $1
      GROUP BY c.id, ct.name, u.username, md.director, md.video_url, msd.artist, msd.audio_url, nd.author, nd.body;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = `
      SELECT c.*, 
             ct.name as content_type_name, 
             u.username as author_name,
             array_agg(DISTINCT cat.id) as category_ids,
             array_agg(DISTINCT cat.name) as category_names,
             md.director as director,
             md.video_url as video_url,
             msd.artist as artist,
             msd.audio_url as audio_url,
             nd.author as author,
             nd.body as body,
             COALESCE(md.video_url, msd.audio_url) as url
      FROM contents c
      LEFT JOIN content_types ct ON c.content_type_id = ct.id
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN content_categories cc ON c.id = cc.content_id
      LEFT JOIN categories cat ON cc.category_id = cat.id
      LEFT JOIN movie_details md ON c.id = md.content_id
      LEFT JOIN music_details msd ON c.id = msd.content_id
      LEFT JOIN news_details nd ON c.id = nd.content_id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND c.status = $${paramCount++}`;
      values.push(filters.status);
    }
    if (filters.userId) {
      query += ` AND c.user_id = $${paramCount++}`;
      values.push(filters.userId);
    }
    if (filters.contentTypeId) {
      query += ` AND c.content_type_id = $${paramCount++}`;
      values.push(filters.contentTypeId);
    }

    query += ` GROUP BY c.id, ct.name, u.username, md.director, md.video_url, msd.artist, msd.audio_url, nd.author, nd.body
               ORDER BY c.created_at DESC;`;

    const result = await pool.query(query, values);
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
    if (data.slug) {
      fields.push(`slug = $${paramCount++}`);
      values.push(data.slug);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.thumbnail) {
      fields.push(`thumbnail = $${paramCount++}`);
      values.push(data.thumbnail);
    }
    if (data.status) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    if (data.publishedAt) {
      fields.push(`published_at = $${paramCount++}`);
      values.push(data.publishedAt);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE contents
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async incrementViews(id) {
    const query = `
      UPDATE contents
      SET views_count = views_count + 1
      WHERE id = $1
      RETURNING views_count;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async softDelete(id) {
    const query = `
      UPDATE contents
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async delete(id) {
    const query = `DELETE FROM contents WHERE id = $1;`;
    await pool.query(query, [id]);
  },
};

module.exports = Content;
