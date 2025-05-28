// server/routes/checkRRRStatus.js
const express = require('express');
const router = express.Router();
const https = require('https');
const cryptoJS = require('crypto-js');

router.get('/check-status/:rrr', (req, res) => {
    const rrr = req.params.rrr;
    const demoUrl = "demo.remita.net";
    const merchantId = "2547916";
    const apiKey = "1946";
    const apiHash = cryptoJS.SHA512(rrr + apiKey + merchantId).toString();

    const options = {
        host: demoUrl,
        path: `/remita/exapp/api/v1/send/api/echannelsvc/${merchantId}/${rrr}/${apiHash}/status.reg`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'remitaConsumerKey=' + merchantId + ',remitaConsumerToken=' + apiHash
        }
    };

    const request = https.request(options, (response) => {
        let str = '';
        response.on('data', (chunk) => str += chunk);
        response.on('end', () => {
            try {
                const jsonResponse = JSON.parse(str);
                res.json(jsonResponse);
            } catch (err) {
                res.status(500).json({ error: 'Failed to parse status response', details: str });
            }
        });
    });

    request.on('error', (e) => {
        res.status(500).json({ error: 'Request failed', details: e });
    });

    request.end();
});

module.exports = router;
