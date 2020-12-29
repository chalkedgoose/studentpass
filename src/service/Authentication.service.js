const Identity = require('../models/Identity');
const argon2 = require('argon2');
const JsonWebTokenGenerator = require('./JsonWebTokenGenerator.service');

class Authentication {

    /**
     * @typedef {Object} PublicIdentityTokenObject
     * @property {string} token - JSON Web Token
     */

    /**
     * Create New Identity
     * @param {string} name 
     * @param {string} email 
     * @param {string} schoolIssuedID 
     * @param {string} school 
     * @param {string} plainTextPassword 
     * @returns {Promise<PublicIdentityTokenObject>}
     */
    async register(name, email, schoolIssuedID, school, plainTextPassword) {

        const hashedPassword = String(await argon2.hash(plainTextPassword, {
            secret: process.env.ARGON_HASHING_SECRET
        }));

        const identityRecord = await Identity.create({
            name, email, schoolIssuedID, password: hashedPassword,
            school
        });

        return {
            token: JsonWebTokenGenerator.generateJsonWebToken({
                _id: identityRecord._id,
                name,
                email,
                schoolIssuedID
            })
        }

    }

    /**
     * Log User In
     * @param {string} email 
     * @param {string} plainTextPassword 
     * @returns {Promise<PublicIdentityTokenObject>}
     */
    async login(email, plainTextPassword) {

        const identityRecord = await Identity.findOne({
            email
        });

        const isValidPassword = await argon2.verify(identityRecord.password, plainTextPassword, {
            secret: process.env.ARGON_HASHING_SECRET,
        });

        if (isValidPassword) {
            return {
                token: JsonWebTokenGenerator.generateJsonWebToken({
                    _id: identityRecord._id,
                    name: identityRecord.name,
                    email: identityRecord.email,
                    schoolIssuedID: identityRecord.schoolIssuedID
                })
            }
        }

        throw new Error('Not the correct password!')

    }

}

module.exports = Authentication;