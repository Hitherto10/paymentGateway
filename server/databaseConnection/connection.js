// const mysql = require("mysql2");
// const { sql } = require('../config');

import mysql from 'mysql2';
import { sql } from '../config.js';

const con = mysql.createConnection({
    host: sql.host,
    user: sql.user,
    password: sql.password,
    database: sql.database,
});
console.log( sql.host);
export default con;