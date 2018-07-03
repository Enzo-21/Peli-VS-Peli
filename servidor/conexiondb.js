var mySql = require("mysql");

var connection = mySql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'sabe364743',
  database: 'competencias'
});

module.exports = connection;
