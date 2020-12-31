import { config } from 'dotenv'
config()
// dotenv.config should always run first

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import mongoose from 'mongoose'
import Ajv from "ajv"
const ajv = new Ajv.default({ allErrors: true })

import { Liquid } from 'liquidjs';
const liquidEngine = new Liquid({
    cache: process.env.NODE_ENV === 'production',
    root: ['views/'],
    extname: '.liquid'
});

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

// third party middleware config
app.use(helmet());
app.use(cors());
app.use(express.static('public'))
app.engine('liquid', liquidEngine.express());
app.set('views', './views');
app.set('view engine', 'liquid');

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


app.get('/', (req, res) => {
    res.render('index');
})



app.get('/register-account', (req, res) => {
    res.render('register-account');
})


app.get('/student-dashboard', (req, res) => {

    function today() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        return mm + '/' + dd + '/' + yyyy;
    }

    res.render('student-dashboard', {
        profile: {
            name: 'Jane Doe',
            email: 'janedoe@college.edu',
            school: 'Smith College',
            schoolIssuedID: '20565697',
            image: '/jane.jpeg'
        },
        thirdPartyApplications: [{
            name: 'Foothill Food Pantry',
            description: `Sint dreamcatcher vinyl you probably haven't heard of them do DIY. Vaporware poke ipsum seitan.`,
            lastLogin: today()
        },
        {
            name: 'Foothill Tutoring Center',
            description: `Sint dreamcatcher vinyl you probably haven't heard of them do DIY. Vaporware poke ipsum seitan.`,
            lastLogin: today()
        },]
    });
})

app.listen(5050, () => {
    console.log('Student Pass 🚀 listening at http://localhost:5050')
})



