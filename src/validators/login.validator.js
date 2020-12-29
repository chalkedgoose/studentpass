const Ajv = require("ajv")
const ajv = new Ajv.default({ allErrors: true })

const schema = {
    type: "object",
    properties: {
        email: { type: "string" },
        plainTextPassword: { type: "string" },
    },
    required: ["email", "plainTextPassword"],
    additionalProperties: false,
}

module.exports = ajv.compile(schema);