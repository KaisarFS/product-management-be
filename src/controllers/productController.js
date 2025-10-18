const { validationResult } = require('express-validator');
const pool = require('../db/pool');

async function getProducts(req, res, next) {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, description, price, image_url, latitude, longitude FROM products ORDER BY id DESC'
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

async function createProduct(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Invalid request data.',
      errors: errors.array(),
    });
  }

  const { name, description, price, imageUrl, latitude, longitude } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO products (name, description, price, image_url, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, description, price, image_url, latitude, longitude`,
      [name, description, price, imageUrl || null, latitude || null, longitude || null]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Invalid request data.',
      errors: errors.array(),
    });
  }

  const productId = Number(req.params.id);
  const { name, description, price, imageUrl, latitude, longitude } = req.body;

  try {
    const { rowCount, rows } = await pool.query(
      `UPDATE products
       SET name = $1,
           description = $2,
           price = $3,
           image_url = $4,
           latitude = $5,
           longitude = $6
       WHERE id = $7
       RETURNING id, name, description, price, image_url, latitude, longitude`,
      [name, description, price, imageUrl || null, latitude || null, longitude || null, productId]
    );

    if (!rowCount) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Invalid request data.',
      errors: errors.array(),
    });
  }

  const productId = Number(req.params.id);
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [productId]);

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
