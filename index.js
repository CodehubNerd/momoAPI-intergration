

const express = require('express');
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors');


const momoservice = require('./Service/momoAPIservice.js');

const app = express();
require('dotenv').config();
const port = 5000;

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


const allowedOrigins = [
    'http://127.0.0.1:5500',
    '*'
];


app.use(cors({
    origin: function (origin, callback) {
        console.log('origin:', origin);
        console.log('allowedOrigins:', allowedOrigins);
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    credentials: true
}));

const apiKey = process.env.OCP_APIM_KEY;
const subscriptionKey = process.env.API_KEY;

app.get('/api/keys', (req, res) => {
    res.json({
        apiKey: apiKey,
        subscriptionKey: subscriptionKey,
    });
});


app.use("/api", momoservice);

app.get('/', (req, res) => {
    res.send('API running');
});

app.listen(port, () => {
    console.log(`server running at port ${port}`);
});
