const mysql = require("mysql2");
const { sql } = require('../config');

const con = mysql.createConnection({
    host: sql.host,
    user: sql.user,
    password: sql.password,
    database: sql.database,
});

module.exports = con;