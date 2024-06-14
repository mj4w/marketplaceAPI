import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
    username: {
        type:String,
        required: true,
        unique: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    desc: {
        type: String,
        required: false,
    },
    isSeller: {
        type: Boolean,
        default: false,
    },
    // reset password
    resetToken: {
        type: String,
    },
    resetTokenExpiration: {
        type: Date,
    },

}, { timestamps: true })

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw(error);
    }
};

export default mongoose.model('User', UserSchema);
