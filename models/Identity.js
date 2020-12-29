import mongoose from 'mongoose';

const IdentitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    schoolIssuedID: {
        type: String,
        required: true,
        unique: true,
    },
    school: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    accessTokenBlacklist: {
        type: [String],
        default: []
    },
    grantedTokenList: {
        type: [String],
        default: []
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export default mongoose.models.Identity || mongoose.model('Identity', IdentitySchema)