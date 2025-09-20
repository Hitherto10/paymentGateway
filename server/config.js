// const dotenv = require('dotenv');
// const mysql = require("mysql2");

import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config( { path: '../.env'} );

export const sql = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
}


export const pg = {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
}

export const remita =  {
    demoUrl: process.env.DEMO_URL,
    genRRRUrlPath: process.env.GENERATE_RRR_PATH,
    merchantId: process.env.MERCHANT_ID,
    apiKey: process.env.API_KEY,
    public_key: process.env.PUBLIC_KEY,
}
