const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.dbSsl ? { rejectUnauthorized: false } : undefined,
});

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected database error', err);
});

module.exports = pool;

