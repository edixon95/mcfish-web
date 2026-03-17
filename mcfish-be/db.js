const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',       // from JDBC
    port: 3306,              // default MySQL port
    user: 'root',            // your MySQL username
    password: 'test',// your MySQL password
    database: 'fish_game'    // database name from JDBC
});

module.exports = db;