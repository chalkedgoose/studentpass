const Ajv = require("ajv")
const ajv = new Ajv({ allErrors: true })

const schema = {
    properties: {
        name: { type: "string" },
        email: { type: "string" },
        schoolIssuedID: { type: "string" },
        school: { type: "string" },
        plainTextPassword: { type: "string" },
    },
}

module.exports = ajv.compile(schema);