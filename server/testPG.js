
import { pg_con } from './databaseConnection/connection.js';


pg_con.connect() .then(() => {
    console.log('connected to the database');
}) .catch((err) => {console.log("Error connecting to database: ", err)});

pg_con.query("SELECT * FROM transaction_history").then((result) => {
    console.log(result.rows);
})