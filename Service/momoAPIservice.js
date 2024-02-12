const express = require('express');
const axios = require('axios');
const router = express.Router();
const uuidv4 = require('uuid').v4;


const momoHost = 'sandbox.momodeveloper.mtn.com';
const momoTokenUrl = `https://${momoHost}/collection/token/`;
const momoRequestToPayUrl = `https://${momoHost}/collection/v1_0/requesttopay`;

let momoToken = null;


// Endpoint to get token
router.post('/get-momo-token', async (req, res) => {
    try {
        const { apiUserId, apiKey, subscriptionKey } = req.body;

        // Concatenate API user ID and API key with a colon
        const credentials = `${apiUserId}:${apiKey}`;
        const encodedCredentials = Buffer.from(credentials).toString('base64');

        const response = await fetch(momoTokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Authorization': `Basic ${encodedCredentials}`,
            },
        });

        const data = await response.json();

        console.log('data from mobile money', data);
        momoToken = data.access_token;

        if (response.ok) {
            res.json({ message: 'Token retrieved successfully' });
        } else {
            res.status(response.status).json({ message: 'Failed to retrieve token' });
        }
    } catch (error) {
        console.error('error from mobile money', error);
        res.status(500).json({ message: 'Server error' });
    }
});


//request to pay 
router.post('/request-to-pay', async (req, res) => {
    try {
        if (!momoToken) {
            return res.status(400).json({ error: 'token not available' });
        }

        const { phoneNumber, totalAmount } = req.body;

        // Generate a UUID
        const referenceId = uuidv4();

        const body = {
            amount: totalAmount,
            currency: "EUR",
            externalId: 15322,
            payer: {
                partyIdType: 'MSISDN',
                partyId: phoneNumber,
            },
            payerMessage: "paying for DSTV",
            payeeNote: "Monthly payaments",
        };

        const momoResponse = await axios.post(
            momoRequestToPayUrl,
            body,
            {
                headers: {
                    'X-Reference-Id': referenceId,
                    'X-Target-Environment': 'sandbox',
                    'Ocp-Apim-Subscription-Key': '36a9cea744d74f268f28dc01085bc3be',
                    Authorization: `Bearer ${momoToken}`,
                    'Content-type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
            }
        );
        res.json({ momoResponse: momoResponse.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
