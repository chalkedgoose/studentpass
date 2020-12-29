import jsonwebtoken from 'jsonwebtoken';

export default class JsonWebTokenGenerator {
    /**
     * Generate JSON Web Token
     * @param {object} payload 
     * @returns {string}
     */
    static async generateJsonWebToken(payload) {
        try {
            const token = await jsonwebtoken.sign(payload, process.env.JSON_WEB_SECRET);
            return token;
        } catch (error) {
            throw new Error(error)
        }
    }

    /**
     * Decodes Student Pass Generated Web Tokens
     * into objects
     * @param {string} token 
     */
    static async generateDecodedJsonWebToken(token) {
        try {
            const decoded = await jsonwebtoken.verify(token, process.env.JSON_WEB_SECRET);
            return decoded;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

}
