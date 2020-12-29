import * as argon2 from 'argon2';
import JsonWebTokenGenerator from './JsonWebTokenGenerator.service.js';
import IdentityRepo from '../repo/Identity.repo.js';
import DecodedAuthenticationJWT from '../dataclasses/DecodedAuthenticationJWT.dataclass.js';
export default class Authentication {

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
    static async register(name, email, schoolIssuedID, school, plainTextPassword) {

        try {
            const hashedPassword = String(await argon2.hash(plainTextPassword, {
                secret: process.env.ARGON_HASHING_SECRET
            }));

            const identityRecord = await IdentityRepo.createIdentity({
                name, email, schoolIssuedID, password: hashedPassword,
                school
            });

            const generatedToken = JsonWebTokenGenerator.generateJsonWebToken({
                _id: identityRecord._id,
                name,
                email,
                schoolIssuedID
            })

            IdentityRepo.addToGrantedTokenList(generatedToken, identityRecord._id)

            return {
                token: generatedToken
            }
        } catch (error) {
            throw error;
        }

    }

    /**
     * Log User In
     * @param {string} email 
     * @param {string} plainTextPassword 
     * @returns {Promise<PublicIdentityTokenObject>}
     */
    static async login(email, plainTextPassword) {

        const identityRecord = await IdentityRepo.findIdentityByEmail(email);

        const isValidPassword = await argon2.verify(identityRecord.password, plainTextPassword, {
            secret: process.env.ARGON_HASHING_SECRET,
        });

        if (isValidPassword) {

            const generatedToken = JsonWebTokenGenerator.generateJsonWebToken({
                _id: identityRecord._id,
                name: identityRecord.name,
                email: identityRecord.email,
                schoolIssuedID: identityRecord.schoolIssuedID
            });

            await IdentityRepo.addToGrantedTokenList(generatedToken, identityRecord._id)

            return {
                token: generatedToken
            }
        }

        throw new Error('Not the correct password!')

    }

    static async accessIdentityData(token) {
        try {
            const userTokenData = await new DecodedAuthenticationJWT(JsonWebTokenGenerator.generateDecodedJsonWebToken(token));
            const userData = await IdentityRepo.findIdentityByID(userTokenData._id);
            return userData;
        } catch (error) {
            throw error;
        }
    }

}