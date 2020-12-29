const Ajv = require("ajv")
const ajv = new Ajv.default({ allErrors: true })

const schema = {
    properties: {
        email: { type: "string" },
        plainTextPassword: { type: "string" },
    },
}

module.exports = ajv.compile(schema);