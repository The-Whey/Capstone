const express = require('express');
const app = express.Router();
const { isLoggedIn, isAdmin } = require('./middleware');
const { createTags } = require('../db/tags');

// Import your PostgreSQL pool setup and replace 'your-database-connection-string' with the actual connection string.
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'your-database-connection-string',
});

app.get('/', async (req, res, next) => {
  try {
    // Replace the SQL query with the one that fetches all tags.
    const tags = await fetchAllTags(); // Implement fetchAllTags function.

    res.send(tags);
  } catch (error) {
    next(error);
  }
});

// Add a new route to fetch tags for a specific product.
app.get('/:productId/tags', async (req, res, next) => {
  const { productId } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT tags.tag FROM tags INNER JOIN product_tags ON tags.id = product_tags.tag_id WHERE product_tags.product_id = $1',
      [productId]
    );

    const tags = result.rows.map(row => row.tag);

    client.release();

    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/', async (req, res, next) => {
  try {
    res.send(await createTags(req.body));
  } catch (error) {
    next(error);
  }
});

module.exports = app;
