const { Pool } = require('pg');

require('dotenv').config();


const pool = new Pool({
  user: String(process.env.USER_ID),
  host: String(process.env.USER_HOST),
  database: String(process.env.USER_DATABASE),
  password: String(process.env.USER_PASSWORD),
  port: String(process.env.USER_PORT)
});

console.log(String(process.env.USER_PASSWORD))

module.exports = pool;
