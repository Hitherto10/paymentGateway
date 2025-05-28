// server/routes/generateRRR.js
const express = require('express');
const router = express.Router();
const https = require('https');
const cryptoJS = require('crypto-js');
let mysql = require('mysql2');


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kenechukwu10",
    database: "payment_gateway"
});

con.connect(function(err) {
    if (err) throw err;
});


router.post('/generate-rrr', (req, res) => {
    const { payerName, payerEmail, payerPhone, amount, description, serviceTypeId} = req.body;

    const demoUrl = "demo.remita.net";
    const genRRRUrlPath = "/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit";
    const merchantId = "2547916";
    const apiKey = "1946";
    // const serviceTypeId = "4430731";
    let d = new Date();
    let orderId = d.getTime();
    // const description = "Payment for Donation 3";
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
        response.on('data', (chunk) => str += chunk);
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

module.exports = router;
