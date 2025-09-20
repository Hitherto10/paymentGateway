// let mysql = require('mysql2');
// const express = require('express');

import mysql from 'mysql2';
import express from 'express';
import { pg_con } from './databaseConnection/connection.js';

const router = express.Router();

// pg_con.connect(function(err) {
//     if (err) throw err;
// });

router.post('/save-to-db', (req, res) =>
{
    const { db_RRR,
        db_payer_name,
        db_description,
        db_status,
        db_amount,
    } = req.body;

    const sql = "INSERT INTO public.transaction_history (RRR, payer_name, description, status, amount) VALUES (?, ?, ?, ?, ?)";

    pg_con.query(sql, [db_RRR, db_payer_name, db_description, db_status, db_amount], (err, result) => {
        if (err) {
            console.error("Error inserting into DB:", err);
            return res.status(500).json({ success: false, error: "Database error" });
        }
        res.json({ success: true });
    });
})

export default router;