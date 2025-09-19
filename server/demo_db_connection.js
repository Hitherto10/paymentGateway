// let mysql = require('mysql2');
// const express = require('express');
// const { sql } = require('./config');
// const con = require('./databaseConnection/connection.js');

import mysql from 'mysql2';
import express from 'express';
import { sql } from './config.js';

import con from './databaseConnection/connection.js'

const router = express.Router();

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

export default router;