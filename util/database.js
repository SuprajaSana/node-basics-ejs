const mysql = require("mysql2");

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node_first_project',
    password:'Saana@123'
})

module.exports = pool.promise();