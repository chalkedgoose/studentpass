/**
 * To be used within the Authentication Service 
 * for the Decoded JWTs generated in the service.
 */
class DecodedAuthenticationJWT {
    constructor({
        _id,
        name,
        email,
        schoolIssuedID
    }) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.schoolIssuedID = schoolIssuedID;
    }

}

module.exports = DecodedAuthenticationJWT;