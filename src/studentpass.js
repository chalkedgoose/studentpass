require('dotenv').config();
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const mongoose = require('mongoose');
const Ajv = require("ajv")
const ajv = new Ajv({ allErrors: true })

mongoose.connect(process.env.MONGO_STORE_URL)

const authenticationService = require('./service/Authentication.service');
const registerValidator = require('./validators/register.validator');
const loginValidator = require('./validators/login.validator');

const app = express();
app.use(helmet());
app.use(cors());

app.post('/register', async (req, res) => {
    try {
        const isValid = registerValidator(req.body);

        if (isValid) {
            const result = await authenticationService.register(req.body.name,
                req.body.email, req.body.schoolIssuedID, req.body.school, req.body.plainTextPassword);
            return res.status(201).json(result);
        }

        throw new Error(ajv.errorsText(registerValidator.errors))

    } catch (error) {
        return res.status(500).send(error);
    }
})

app.post('/login', async (req, res) => {
    try {
        const isValid = loginValidator(req.body);

        if (isValid) {
            const result = await authenticationService.login(req.body.email, req.body.plainTextPassword);
            return res.status(201).json(result);
        }

        throw new Error(ajv.errorsText(loginValidator.errors))

    } catch (error) {
        return res.status(500).send(error);
    }
})

app.listen(5050, () => {
    console.log('Student Pass listening at http://localhost:5050')
})



