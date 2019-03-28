const Pool = require('pg').Pool 
    console.log(" U are Connected to database!");
    
var pool;

module.exports.pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'users',
  password: 'postgres',
  port: 5432,
})
