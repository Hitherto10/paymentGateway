let mysql = require('mysql2');
const express = require('express');
const router = express.Router();


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kenechukwu10",
    database: "payment_gateway"
});

con.connect(function(err) {
    if (err) throw err;
});

router.get('/service-types', (req, res) => {
    con.query("SELECT * FROM payment_gateway.service_types", (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err });
        }
        res.json(results);
    });
})

module.exports = router;