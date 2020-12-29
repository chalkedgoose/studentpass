import Ajv from "ajv"
const ajv = new Ajv.default({ allErrors: true })

const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
        email: { type: "string" },
        schoolIssuedID: { type: "string" },
        school: { type: "string" },
        plainTextPassword: { type: "string" },
    },
    required: ["name", "email", "schoolIssuedID", "school", "plainTextPassword"],
    additionalProperties: false,
}

export default ajv.compile(schema);