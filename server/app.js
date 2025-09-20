import express from 'express';
import bodyParser from 'body-parser';
import generateRRR from './routes/generateRRR.js';
import checkStatus from './routes/checkRRRStatus.js';
import getServiceTypes from './getServiceTypes.js';
import save_to_db from './savetodatabase.js';
import transacHistory from './getTransacHistory.js';
import cors from 'cors';


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
