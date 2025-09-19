// let mysql = require('mysql2');
// const express = require('express');
// const { sql } = require('./config');

import mysql from 'mysql2';
import express from 'express';
import { sql } from './config.js';

const router = express.Router();

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

export default router;