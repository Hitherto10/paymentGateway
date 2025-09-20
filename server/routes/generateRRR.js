import express from 'express';
import https from 'https';
import cryptoJS from 'crypto-js';
import { remita } from '../config.js';
import { pg_con } from '../databaseConnection/connection.js';

const router = express.Router();




router.post('/generate-rrr', (req, res) => {
    const { payerName, payerEmail, payerPhone, amount, description, serviceTypeId} = req.body;

    const demoUrl = remita.demoUrl;
    const genRRRUrlPath = remita.genRRRUrlPath;
    const merchantId = remita.merchantId;
    const apiKey = remita.apiKey;
    let d = new Date();
    let orderId = d.getTime();
    const apiHash = cryptoJS.SHA512(merchantId + serviceTypeId + orderId + amount + apiKey).toString();


    const payload = JSON.stringify({
        serviceTypeId,
        amount,
        orderId,
        payerName,
        payerEmail,
        payerPhone,
        description
    });

    const options = {
        host: demoUrl,
        path: genRRRUrlPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'remitaConsumerKey=' + merchantId + ',remitaConsumerToken=' + apiHash
        }
    };

    const request = https.request(options, (response) => {
        let str = '';
        response.on('data', (dataStream) => str += dataStream);
        response.on('end', () => {
            try {
                const jsonString = str.substring(str.indexOf('{'), str.lastIndexOf('}') + 1);
                const jsonResponse = JSON.parse(jsonString);
                res.json(jsonResponse);
                console.log(payload);
            } catch (err) {
                res.status(500).json({ error: 'Failed to parse RRR response', details: str });
            }
        });
    });

    request.on('error', (e) => {
        res.status(500).json({ error: 'Request failed', details: e });
    });

    request.write(payload);
    request.end();
});

export default router;
