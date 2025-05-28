// server/app.js
const express = require('express');
const bodyParser = require('body-parser');
const generateRRR = require('./routes/generateRRR');
const checkStatus = require('./routes/checkRRRStatus');
const getServiceTypes = require('./demo_db_connection');
const save_to_db = require('./savetodatabase');
const transacHistory = require('./getTransacHistory');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/api', generateRRR);
app.use('/api', checkStatus);
app.use('/api', getServiceTypes);
app.use('/api', save_to_db);
app.use('/api', transacHistory);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
