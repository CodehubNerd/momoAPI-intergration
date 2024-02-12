const express = require('express');
const axios = require('axios');
const router = express.Router();
const uuidv4 = require('uuid').v4;

const momoHost = 'sandbox.momodeveloper.mtn.com';
const momoTokenUrl = `https://${momoHost}/collection/token`;
const momoRequestToPayUrl = `https://${momoHost}/collection/v1_0/requesttopay`;

let momoToken = null;

//get token
router.post('/get-momo-token', async (req, res) => {
    try {
        const { apiKey, subscriptionKey } = req.body;
        console.log('apikey', apiKey)
        console.log('subscriptionKey', subscriptionKey)

        const momoTokenResponse = await axios.post(
            momoTokenUrl,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': subscriptionKey,
                    Authorization: `Basic ${apiKey}`,
                },

            }
        )
        console.log('data from mobile money', momoTokenResponse.data)
        momoToken = momoTokenResponse.data.access_token;
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
            currency: 'SZL',
            externalId: '1532',
            payer: {
                partyIdtype: 'MSISDN',
                partyId: phoneNumber,
            },
            payerMessage: 'Payment for DSTV',
            payeeNote: 'Your DSTV monthly subscriptions',
        };

        const momoResponse = await axios.post(
            momoRequestToPayUrl,
            body,
            {},
            {
                headers: {
                    'X-Reference-Id': referenceId,
                    'X-Target-Enviroment': 'sandbox',
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
