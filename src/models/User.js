import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        unique: true
    },
    phone_number: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    is_landlord: {
        type: Boolean,
        default: false
    },
    account_status: {
        type: String,
        default: 'active'
    },
    user_type: {
        type: String,
        default: 'user'
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;