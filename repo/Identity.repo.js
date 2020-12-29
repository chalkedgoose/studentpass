import IdentityModel from '../models/Identity.js'

export default class Identity {
    /**
     * Finds identity by email
     * @param {string} email 
     */
    static async findIdentityByEmail(email) {
        return IdentityModel.findOne({ email })
            .exec()
    }

    /**
     * Finds identity by ID
     * @param {string} _id 
     */
    static async findIdentityByID(_id) {
        return IdentityModel.findById(_id)
            .exec()
    }

    /**
     * Adds token to the token blacklist
     * @param {string} token 
     * @param {string} _id 
     */
    static async addToAccessTokenBlacklist(token, _id) {
        try {
            const addOperation = await IdentityModel.findByIdAndUpdate(_id,
                {
                    $push: { accessTokenBlacklist: token },
                    $pull: { grantedTokenList: token }
                }).exec();
            return addOperation;
        } catch (error) {
            throw error;
        }
    }


    /**
     * Adds Token to grantedTokenList
     * @param {string} token 
     * @param {string} _id 
     */
    static async addToGrantedTokenList(token, _id) {
        try {
            const addOperation = IdentityModel.findByIdAndUpdate(_id,
                { $push: { grantedTokenList: token } }).exec();
            return addOperation;
        } catch (error) {
            throw error;
        }
    }

    // /**
    //  * Returns a list of active tokens
    //  */
    // static async get grantedTokenList(_id) {
    //     try {
    //         return IdentityModel.findById(_id)
    //             .select('grantedTokenList -_id')
    //             .exec()
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    static async createIdentity({ name, email, schoolIssuedID, password, school }) {
        try {
            const identityRecord = await Identity.create({
                name, email, schoolIssuedID, password,
                school
            });
            return identityRecord;
        } catch (error) {
            throw error;
        }
    }
}
