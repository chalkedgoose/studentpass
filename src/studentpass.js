
import { config } from 'dotenv'
config()

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import mongoose from 'mongoose'
import Ajv from "ajv"
const ajv = new Ajv.default({ allErrors: true })

mongoose.connect(process.env.MONGO_STORE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
})

import authenticationService from './service/Authentication.service.js';
import registerValidator from './validators/register.validator.js';
import loginValidator from './validators/login.validator.js';

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
    console.log('Student Pass 🚀 listening at http://localhost:5050')
})



