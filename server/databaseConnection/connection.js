import { Client } from 'pg';
import { pg } from '../config.js';

export const pg_con = new Client({
    user: pg.user,
    host: pg.host,
    database: pg.database,
    password: pg.password,
});

pg_con.connect(function(err) {
    if (err) throw err;
});