const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "1598",
  host: "localhost", //need to be changed to db's IP if deployed on different host.
  port: 5432,
  database: "messages"
});

module.exports = pool;