let mysql = require('mysql2');
const express = require('express');
const router = express.Router();
const { sql } = require('./config');


const con = mysql.createConnection({
    host: sql.host,
    user: sql.user,
    password: sql.password,
    database: sql.database,
});

con.connect(function(err) {
    if (err) throw err;
});

router.get('/transaction-history', (req, res) => {
    con.query("SELECT * FROM payment_gateway.transaction_history", (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err });
        }
        res.json(results);
    });
})

module.exports = router;