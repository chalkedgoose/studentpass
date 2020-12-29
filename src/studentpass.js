require('dotenv').config();
const express = require('express')
const helmet = require('helmet')
const argon2 = require('argon2')
const ajv = require('ajv')
const cors = require('cors')
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_STORE_URL)

const app = express();
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(5050, () => {
    console.log('Student Pass listening at http://localhost:5050')
})



