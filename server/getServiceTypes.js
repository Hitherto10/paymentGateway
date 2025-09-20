import express from 'express';
import { pg_con } from './databaseConnection/connection.js';

const router = express.Router();

router.get('/service-types', (req, res) => {
    pg_con.query("SELECT * FROM public.service_types", (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err });
        }
        res.json(results.rows);
    });
})

export default router;