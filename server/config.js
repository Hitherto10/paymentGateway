const dotenv = require('dotenv');
const mysql = require("mysql2");
dotenv.config();

module.exports = {
    sql: {
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DATABASE
    },
    remita: {
        demoUrl: process.env.DEMO_URL,
        genRRRUrlPath: process.env.GENERATE_RRR_PATH,
        merchantId: process.env.MERCHANT_ID,
        apiKey: process.env.API_KEY,
    }
}
